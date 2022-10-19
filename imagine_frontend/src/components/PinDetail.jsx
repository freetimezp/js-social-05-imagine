import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { MdDownloadForOffline } from 'react-icons/md';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { Link, useParams } from 'react-router-dom';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetail = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`)
        .then((data) => {
          setPinDetail(data[0]);

          if (data[0]) {
            const query1 = pinDetailMorePinQuery(data[0]);

            client.fetch(query1)
              .then((res) => setPins(res));
          }
        });
    }
  }

  useEffect(() => {
    fetchPinDetail();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment('');
          setAddingComment(false);
          window.location.reload();
        })
    }
  }

  if (!pinDetail) return <Spinner message="Loading pin..." />

  return (
    <>
      {pinDetail && (
        <div className="flex xl-flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              src={pinDetail?.image && urlFor(pinDetail.image).url()}
              alt="pin"
              className="rounded-t-3xl rounded-b-lg"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between rounded-md shadow-lg shadow-indigo-400 mb-5">
              <div className="flex gap-2 items-center ml-4">
                <a
                  href={`${pinDetail?.image?.assets?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark
                      text-xl opacity-75 transition-all hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a
                href={pinDetail.destination}
                target="_blank"
                rel="noreferrer"
                className="mr-6"
              >
                {pinDetail.destination}
              </a>
            </div>

            <div>
              <h1 className="text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>

            <Link to={`user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
              <img src={pinDetail.postedBy?.image} alt="user" className="w-8 h-8 object-cover rounded-full" />
              <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
            </Link>

            <h2 className="mt-5 text-2xl">Comments</h2>

            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((comment, index) => (
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={index}>
                  <img
                    src={comment?.postedBy.image}
                    alt="user"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{comment.postedBy.userName}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center flex-wrap mt-6 gap-3">
              <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
                <img src={pinDetail.postedBy?.image} alt="user" className="w-10 h-10 cursor-pointer rounded-full" />
              </Link>
              <input
                className="flex-1 border-2 border-gray-300 outline-none p-2 rounded-2xl focus:border-blue-300"
                type="text"
                placeholder="Add a comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-blue-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Posting comment...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins.." />
      )}
    </>
  )
}

export default PinDetail;
