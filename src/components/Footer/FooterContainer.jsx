import React from 'react';
import Sitemap from './Sitemap';
import FooterBar from './FooterBar';
import { Row } from '../General';

export default function FooterContainer() {
  return (
    <Row>
      <Sitemap />
      <FooterBar />
    </Row>
  );
}
