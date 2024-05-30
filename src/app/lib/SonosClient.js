"use client"

import axios from 'axios'
import {useState} from 'react';

const SonosClient = axios.create({
  baseURL: 'http://192.168.1.179:5005',
});

export const handleInput = async ({zone, operation, param}) => {
  SonosClient.get(`/${zone}/${operation}/${param}`)
  .then(
    res => {
      console.log(res);
    }
  )
}

export const useSonosInfo = () => {
  const [songInfo, setSongInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getInfo = async (zone) => {
    try {
      setIsLoading(true);
      const res = await SonosClient.get(`/${zone}/state`);
      setSongInfo(res.data);
    } catch (e) {
      console.log(`ERR: ${e}`)
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    songInfo,
    getInfo,
  };
}