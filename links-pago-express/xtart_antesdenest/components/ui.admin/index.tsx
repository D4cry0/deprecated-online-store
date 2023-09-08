import { FC, ReactNode } from 'react';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';

interface Props {
    children: ReactNode;
    title?: string;
}

const UIAdmin:FC<Props> = ({ title , children }) => {
  return (
      <>
            <Head>
                <title>{ title }</title>
            </Head>

            <Container className='d-flex flex-row m-0 p-0 w-100 mw-100 vh-100 h-100'>
                { children }
            </Container>

      </>
  )
};

export default UIAdmin;