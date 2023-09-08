import { Layout } from "@/components/layouts";
import { NextPage } from "next";
import Button from "react-bootstrap/Button";

const Home: NextPage = () => {
    return (
        <Layout title="Admin">
            <h1>Holaaa</h1>
            <Button variant="primary">TEST</Button>
            <Button variant="secondary">TEST</Button>
            <Button variant="info">TEST</Button>
            <Button variant="warning">TEST</Button>
            <Button variant="danger">TEST</Button>
            <Button variant="success">TEST</Button>
        </Layout>
    )
}

export default Home;