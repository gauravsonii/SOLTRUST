import { useEffect, useState } from "react";

const APIKEY = process.env.REACT_APP_GIPHY_API;

const useFetch = ({keyword}) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );
      const { data } = response.json();
      setGifUrl(data[0]?.images?.downsized?.url);
    } catch (error) {
      setGifUrl(
        "https://i.pinimg.com/originals/68/a0/9e/68a09e774e98242871c2db0f99307420.gif"
      );
    }
  };

  useEffect(()=>{
        if(keyword)fetchGifs();
  },[keyword])
  return gifUrl;
};

export default useFetch;