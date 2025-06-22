import { useState, useEffect } from 'react';
import axios from 'axios';

const FeedPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get('https://strmly-backend.onrender.com/api/videos');
        setVideos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos');
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  if (loading) return <div className="text-center py-8">Loading videos...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Video Feed</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative pb-[56.25%] h-0">
              <video 
                controls 
                className="absolute top-0 left-0 w-full h-full"
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{video.title}</h3>
              <p className="text-gray-600 mb-2">{video.description}</p>
              <div className="text-sm text-gray-500">
                <span>By: {video.uploaderName}</span>
                <span className="ml-4">
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {videos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No videos available. Be the first to upload!
        </div>
      )}
    </div>
  );
};

export default FeedPage;
