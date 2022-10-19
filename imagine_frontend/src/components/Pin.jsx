import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();

    const user = fetchUser();
    //console.log(postedBy);
    //console.log(_id);

    

    //set it as bool
    const alreadySaved =!!(save?.filter((item) => item.postedBy._id === user._id))?.length;
    //console.log(alreadySaved);

    const savePin = (id) => {
        setSavingPost(true);

        if(!alreadySaved && save === null) {
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user._id,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className="m-2">   
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all 
                    duration-500 ease-in-out"
            >
                <img src={urlFor(image).width(250).url()} alt="pin post" className="rounded-lg w-full" />
                {postHovered && (
                    <div
                        className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                        style={{ height: '100%' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <a 
                                    href={`${image?.assets?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark
                                        text-xl opacity-75 transition-all hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button type="button" className="bg-green-500 opacity-60 hover:opacity-100 text-white
                                    font-bold p-2 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                >
                                    {save?.length} Saved
                                </button>
                            ) : (
                                <button 
                                    type="button" 
                                    className="bg-blue-500 opacity-60 hover:opacity-100 text-white
                                    font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);                                    
                                    }}
                                >
                                    Save
                                </button>
                            )}
                        </div>

                        <div className="flex justify-between items-center gap-2 w-full">
                            {destination && (
                                <a
                                    href={destination}
                                    target="_blank"
                                    rel='noreferrer'
                                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4
                                    rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination?.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                                </a>
                            )}
                            {postedBy?._id === user._id && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className="bg-white opacity-60 hover:opacity-100 text-red-500 border-2 border-red-500
                                    font-bold p-1 text-base rounded-3xl hover:shadow-md outline-none flex items-center
                                    justify-center"
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
                <img src={postedBy?.image} alt="user" className="w-8 h-8 object-cover rounded-full" />
                <p className="font-semibold capitalize">{postedBy?.userName.slice(0,20)}</p>
            </Link>
        </div>
    )
}

export default Pin;
