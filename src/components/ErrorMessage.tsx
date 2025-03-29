
import React from 'react';

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
      <p className="font-medium">Error loading data</p>
      <p>{error}</p>
      <p className="mt-2 text-sm">
        Note: This application requires Supabase integration with a countries table. 
        Please connect your Supabase project with the appropriate schema.
      </p>
    </div>
  );
};

export default ErrorMessage;
