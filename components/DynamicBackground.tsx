import React from 'react';

const DynamicBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden">
      <div className="absolute w-full h-full">
        <div 
          className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div 
          className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicBackground;