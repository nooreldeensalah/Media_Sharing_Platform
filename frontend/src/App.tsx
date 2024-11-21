import React from 'react';
import MediaList from './components/MediaList';
import UploadMedia from './components/UploadMedia';

const App: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center p-4">
            <header className="w-full bg-white shadow mb-6 p-4">
                <h1 className="text-3xl font-bold text-blue-600">Media Sharing Platform</h1>
                <p className="text-gray-600 mt-2 text-center">
                    Upload and explore your media files with ease.
                </p>
            </header>
            <main className="w-full max-w-5xl space-y-6">
                <section>
                    <UploadMedia />
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-4">Your Media Gallery</h2>
                    <MediaList />
                </section>
            </main>
            <footer className="w-full text-center mt-6 p-4 text-gray-500 text-sm">
                &copy; 2024 Media Sharing Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default App;
