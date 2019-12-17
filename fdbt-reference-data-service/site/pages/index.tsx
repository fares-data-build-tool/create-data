import React from 'react';
import axios, {
  AxiosResponse,
} from 'axios';
import { NextPageContext } from 'next'

export interface HomeProps {
  serverTime: string,
  uuid: string
}

const Home = (props: HomeProps) => {
  console.log("debug");
    return (
      <div>Welcome to Next.js! {props.serverTime} {props.uuid} </div>
    );
}

Home.getInitialProps = async (ctx: NextPageContext) => {
  const { req } = ctx;
  let host = req.headers['host'];
  if(host && host.includes('localhost')){
    host = "http://"+host;
  }else {
    host = "https://"+host;
  }
  const url = host + '/api/uuid';
  console.log(url);
  const uuid = await axios.get(url)
  .then((response: AxiosResponse) => response.data.uuid)
  .catch(error => console.log(error.message));
  return { serverTime: new Date().toUTCString(), uuid };
};

export default Home;