import { useEffect,useRef } from 'react'

export const useComponentDidMount = () => {
    const ref = useRef();
    useEffect(() => {
      ref.current = true;
    }, []);
    return ref.current;
};