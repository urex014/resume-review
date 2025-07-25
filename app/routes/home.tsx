import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Navbar from "~/components/Navbar";
import { resumes } from "constants/index";
import ResumeCard from "~/components/ResumeCard";
import {useEffect} from 'react';
import { useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Connected" },
    { name: "description", content: "smart feedback for your dream job" },
  ];
}

export default function Home() {
const {isLoading,auth} = usePuterStore();
    const location = useLocation();
    // const next=location.search.split('next=')[1]
    const navigate=useNavigate();
    useEffect(()=>{
        if(!auth.isAuthenticated)navigate('/auth?next=/')
    }), [auth.isAuthenticated]

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications and resume rating</h1>
        <h2>Review your submissions and get an ai powered feedback</h2>
      </div>
    {resumes.length>0 && (
      <div className="resumes-section">
        {resumes.map((resume)=>(
      <div className="resume-section">
        <ResumeCard key={resume.id} resume={resume} />
      </div>
    ))}
      </div>
    )}
    </section>
  </main>;
}
