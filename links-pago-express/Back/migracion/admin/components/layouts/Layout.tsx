import { FC, ReactNode } from 'react';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';

interface Props {
    children: ReactNode;
    title?: string;
}

export const Layout:FC<Props> = ({ title , children }) => {
  return (
      <div>
            <Head>
                <title>{ title }</title>
            </Head>

            <Container className='m-0 p-0'>
                { children }
            </Container>

      </div>
  )
};
