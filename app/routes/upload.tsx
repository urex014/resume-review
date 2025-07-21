import React, { type FormEvent } from 'react'
import Navbar from '~/components/Navbar'
import {useState} from 'react'
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { generateuuid } from '~/lib/utils';
import { convertPdfToImage } from '~/lib/pdf2image';
// import { stringify } from 'querystring';
import { prepareInstructions } from '../../constants';

const upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const[isProcessing, setIsProcessing]=useState(false);
    const[statusText, setStatusText]=useState('')
    const [file, setFile] = useState<File | null>(null);


interface AnalyzeInput{
    companyName:string,
    jobTitle:string,
    jobDescription:string,
    file:File
}

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateuuid();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription, AIResponseFormat: 'json' })
        );
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }



    const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string; 
        const jobDescription = formData.get('job-description') as string;
        if(!file) return;
        handleAnalyze({companyName, jobTitle, jobDescription, file});
}

const handleFileSelect=(file:File|null)=>{
    setFile(file)
}

  return (
    <main className="bg-[url('/images/bg-main.svg)]'" bg-cover>
        <Navbar/>
        <section className='main-section'>
            <div className='page-heading py-16'>
                <h1>smart feedback for yoru dream job</h1>
                {isProcessing?(
                    <>
                        <h2>{statusText}</h2>
                        <img src='/images/resume-scan.gif' className='w-full'></img>
                    </>

                ):(
                    <h2>upload your resume now for my ai to scan and help you improve your resume</h2>
                )}
                {!isProcessing&&(
                    <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                        <div className='form-div'>
                            <label htmlFor='company-name'>Company</label>
                            <input type='text' name='company-name' placeholder='company name' />
                        </div>
                        <div className='form-div'>
                            <label htmlFor='job-title'>job title</label>
                            <input type='text' name='job-title' placeholder='job title' />
                        </div>
                        <div className='form-div'>
                            <label htmlFor='job-description'>job description</label>
                            <textarea rows={5} name='job-description' placeholder='job description' />
                        </div>
                        <div className='form-div'>
                            <label htmlFor='uploader'>upload resume</label>
                            <div>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                        </div>
                        <button className='primary-button' type='submit'>Analyze resume</button>
                        
                    </form>
                )}
            </div>

        </section>
    </main>
  )
}

export default upload