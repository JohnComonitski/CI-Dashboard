import { useEffect } from 'react';

const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    /*
    script.onLoad = onload;
    script.onreadystatechange=() => {
      if(script.readyState === 'complete'){
        script.onload();
      }
    };*/
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};

export default useScript;
