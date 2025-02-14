import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const DropDown = ({ type, value, onChange, availableFiles, availableTempos }) => {
  const [options, setOptions] = useState(["Loading..."]);
  const [micPermission, setMicPermission] = useState(false);

  useEffect(() => {
      if (type === "file") {
        setOptions(availableFiles);
      } else if (type === "tempo") {
        setOptions(availableTempos);
      } else if (type === "mic") {
        // Request microphone access before listing devices
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            setMicPermission(true);
            navigator.mediaDevices.enumerateDevices().then(devices => {
              const mics = devices.filter(device => device.kind === "audioinput");
              setOptions(mics.map(mic => ({ label: mic.label || "Unknown Mic", value: mic.deviceId })));
            });
          })
          .catch(error => {
            console.error("Microphone permission denied:", error);
            setMicPermission(false);
          });
      }
    }, [type]);
  
    return (
      <div className='flex flex-row gap-x-2 gap-y-4'>
        <label>{type === "mic" ? "Microphone" : type === "file" ? "File" : "Tempo"}: </label>
        
        {type === "mic" ? (
          micPermission ? (
            <select className='border border-gray-300 w-[220px] h-[30px]' value={value} onChange={onChange}>
              {options.length > 0 ? (
                options.map((mic, index) => (
                  <option key={mic.value || index} value={mic.value}>
                    {mic.label}
                  </option>
                ))
              ) : (
                <option>No Microphones Found</option>
              )}
            </select>
          ) : (
            <span className="text-red-500">Microphone access denied</span>
          )
        ) : (
          <select className='border border-gray-300 w-[220px] h-[30px]' value={value} onChange={onChange}>
            {options.map((option, index) => (
              <option key={`${type}-${index}`} value={type === "file" && option !== "--Custom ABC--" ? `./music/${option}` : option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };
  
  DropDown.propTypes = {
    type: PropTypes.oneOf(['mic', 'file', 'tempo']).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  
  export default DropDown;