import type {Project,Participant} from './types'; import {initialProjects} from './data';
const KEY='planeja-secti-v2-oficial'; export interface Store{projects:Project[];participant?:Participant;history:{at:string;author:string;project:string;summary:string}[]}
export function load():Store{try{return JSON.parse(localStorage.getItem(KEY)||'') as Store}catch{return {projects:initialProjects,history:[]}}}
export function save(s:Store){localStorage.setItem(KEY,JSON.stringify(s)); window.dispatchEvent(new Event('secti-saved'))}
