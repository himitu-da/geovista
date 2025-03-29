
import React from 'react';

interface MapboxKeyFormProps {
  onKeySubmit: (key: string) => void;
}

const MapboxKeyForm: React.FC<MapboxKeyFormProps> = ({ onKeySubmit }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      mapbox_key: { value: string };
    };
    const newKey = target.mapbox_key.value;
    onKeySubmit(newKey);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Mapbox API Key Required</h2>
        <p className="mb-4">
          Please enter your Mapbox public access token to load the map. 
          You can get one from <a href="https://account.mapbox.com/access-tokens/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Mapbox</a>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mapbox_key" className="block mb-1 font-medium">
              Mapbox Public Token
            </label>
            <input
              type="text"
              id="mapbox_key"
              name="mapbox_key"
              className="w-full p-2 border rounded"
              placeholder="Enter your Mapbox public token"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save & Load Map
          </button>
        </form>
      </div>
    </div>
  );
};

export default MapboxKeyForm;
