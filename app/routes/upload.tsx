import React, { type FormEvent } from 'react'
import Navbar from '~/components/Navbar'
import {useState} from 'react'
import FileUploader from '~/components/fileUploader';

const upload = () => {
    const[isProcessing, seIsProcessing]=useState(false);
    const[statusText, setSatatusText]=useState('')
    const [file, setFile] = useState<File | null>(null);


    const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description')
        console.log(companyName)
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