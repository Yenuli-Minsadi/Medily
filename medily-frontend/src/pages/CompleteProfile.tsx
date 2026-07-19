import React from 'react';

const CompleteProfile = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a1929] text-white">
            <div className="bg-[#112240] p-8 rounded-xl shadow-lg border border-blue-500/20 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
                <p className="text-gray-400 mb-6">We just need a few more details to set up your Medily account.</p>
                {/* Add your form fields here later */}
                <button className="w-full bg-blue-600 py-3 rounded-lg font-semibold">Save Details</button>
            </div>
        </div>
    );
};

export default CompleteProfile;