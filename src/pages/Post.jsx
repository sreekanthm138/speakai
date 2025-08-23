import { useParams } from 'react-router-dom'
import { posts } from '../posts'
export default function Post(){const {slug}=useParams();const post=posts.find(p=>p.slug===slug);if(!post) return <main className='container-p py-10'><h1>Not found</h1></main>;return(<main className='container-p py-10 max-w-3xl'><article><h1 className='text-3xl font-bold mb-2'>{post.title}</h1><p className='text-muted text-sm mb-6'>Updated {post.date}</p><div dangerouslySetInnerHTML={{__html:post.html}}/></article></main>)}
