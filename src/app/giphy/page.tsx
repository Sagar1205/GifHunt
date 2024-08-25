"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type GifType = {
    id: string,
    url: string,
    title: string;
};

const GiphySearch = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    dotenv.config()
    const [query,setQuery] = useState<string>('');
    const [gifs,setGifs] = useState<GifType[]>([]);
    const [offset,setOffset] = useState<number>(0);
    const [loading,setLoading] = useState<boolean>(false);
    const limit: number = 3

    if (status === "unauthenticated") {
        router.push("/signup");
    }

    const searchGif = useCallback(async () => {
        if(query === ""){
            setGifs([])
            return
        }
        setLoading(true)
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_GIFHY_API_URL as string, {
                params: {
                    api_key: process.env.NEXT_PUBLIC_GIFHY_API_KEY,
                    q: query,
                    offset
                }
            })

            const gifs: GifType[] = response.data.data.map((gif: any) => ({
                id: gif.id,
                url: gif.images.fixed_height.url,
                title: gif.title
            }));
            
            if(offset === 0){
                setGifs(gifs)
            }else{
                setGifs((prevGifs) => [...prevGifs, ...gifs])
            }

        }catch(error){
            console.error('Something went wrong!', error)
        }
        setLoading(false)
    },[query,offset])

    useEffect(() => {
        searchGif()
    },[searchGif])

    const handleSearch = () => {
        setOffset(0)
        searchGif()
    }

    const handlePrevious = () => {
        if(offset >= limit){
            setOffset(offset - limit)
        }
    }

    const handleNext = () => {
        setOffset(offset + limit)
    }

    return (
        <div className="bg-gray-100 min-h-screen px-[5rem] py-[3rem]">
            <div className="flex flex-col items-center justify-center bg-white p-6 gap-2">
                <div className="flex gap-4 w-full flex-grow">
                    <input
                        type="text"
                        placeholder="Search Gifs"
                        onChange={e => setQuery(e.target.value)}
                        value={query}
                        className="p-2 block w-full focus:ring-2 rounded-lg text-gray-800 bg-gray-100"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-black p-[7px] rounded-lg"
                    >
                        Search
                    </button>
                </div>
                <div className="flex gap-1 min-w-1/3 max-h-[23rem]">
                    {loading && <div aria-label="Loading..." role="status" className="loader-container min-h-[23rem]">
                        <svg className="loader-svg" viewBox="0 0 256 256">
                            <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                        </svg>
                        <span className="loader-text">Loading...</span>
                    </div>}
                    {gifs.slice(offset, offset + limit).map(gif => (
                        // <div className="" key={gif.id}>
                            <Image 
                                key={gif.id}
                                alt={gif.title}
                                src={gif.url}
                                width={600}
                                height={400}
                                className="rounded-lg"
                            />
                            //<div className="text-gray-700 mt-2 text-base text-center">{gif.title}</div>
                        // </div>
                    ))}
                </div>
                {gifs.length > 3 && <div className="flex justify-center mt-4 gap-1">
                    <button
                        onClick={handlePrevious}
                        disabled={offset === 0}
                        className="text-gray-800 cursor-pointer font-semibold p-1 hover:bg-gray-500 rounded-md hover:text-white"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={offset +limit >= gifs.length}
                        className="text-gray-800 cursor-pointer font-semibold p-1 hover:bg-gray-500 rounded-md hover:text-white"
                    >
                        Next
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default GiphySearch