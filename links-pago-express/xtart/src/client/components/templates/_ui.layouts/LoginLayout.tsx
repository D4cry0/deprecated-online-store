import React, { FC, ReactNode } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

interface Props {
    children: ReactNode;
}

export const LoginLayout: FC<Props> = ({children}) => {
    return (
        <section className='py-4 py-xl-5'>
            <Container >
                <Row className='d-flex justify-content-center'>
                    <Col md='8' lg='6' xl='5' xxl='4'>
                        { children }
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
