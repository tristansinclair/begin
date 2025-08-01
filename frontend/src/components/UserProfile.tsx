'use client';
import React from 'react';
import { fakeUserProfile } from '../data/fakeUserData';

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Fake User Data (JSON View)</h1>
            
            {/* JSON Display */}
            <div className="bg-card border rounded-2xl p-6">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code className="language-json">
{JSON.stringify(fakeUserProfile, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        </main>
    </div>
  );
};

export default UserProfile;