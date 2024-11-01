"use client";
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/inbox"); // Navigate to Inbox or relevant page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Welcome to the Home Page!
        </h1>
        <p className="text-lg md:text-xl font-medium">
          Discover messages, connect with your team, and stay updated with our latest notifications.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-4 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
