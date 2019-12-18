import '../design/Layout.scss'
import React from "react";
import Header from './Header';
import AlphaBanner from './AlphaBanner';
import Footer from './Footer';
import LogoBanner from './LogoBanner';
import Head from 'next/head';
import img from '../public/assets/images/favicon.ico'

export interface LayoutProps {
  title: string;
  description: string
}

export default class Layout extends React.Component <LayoutProps> {
    render() {
        return (
          <div>
            <Head>
              <link rel="shortcut icon" href={img} />
              <title>{ this.props.title || 'Fares Data Build Tool' }</title>
              <meta name='description' content={this.props.description || 'Fares Data Build Tool'} />
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <meta charSet='utf-8' />
            </Head>

            <Header/>
            <div className="govuk-width-container app-width-container--wide">
              <AlphaBanner/>
              <div className="dftlogo"></div>
              <LogoBanner/>
              {/* <h1>{this.props.name}</h1> */}
              {this.props.children}
            </div>
            <Footer/>
          </div>
        );
    }
}
