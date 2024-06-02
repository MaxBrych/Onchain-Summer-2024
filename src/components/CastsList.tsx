import React from "react";

const CastsList = ({ casts }: any) => {
  return (
    <div className="  p-6 mt-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Farcaster Casts</h2>
      {casts.length > 0 ? (
        casts.map((cast: any, index: any) => (
          <div key={index} className="border-b border-gray-300 py-4">
            <p className="text-gray-400">{new Date(cast.castedAtTimestamp).toLocaleString()}</p>
            <p className="mt-2">{cast.text}</p>
            <div className="mt-2 flex space-x-4 text-sm text-gray-400">
              <span>Recasts: {cast.numberOfRecasts}</span>
              <span>Likes: {cast.numberOfLikes}</span>
              <a
                href={cast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View on Farcaster
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>No casts available</p>
      )}
    </div>
  );
};

export default CastsList;
