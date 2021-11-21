import styled from 'styled-components';
import background from '../assets/back.jpg';
import {colors} from '../constants/colors';
import {Link} from 'react-router-dom';

const Header = styled.header`
    height: 100vh;
    width: 100%;
    background: url(${background});
    background-size: cover;
    background-position: 'center center';
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const Title = styled.h1`
    font-weight: 800;
    font-size: 28px;
    color: ${colors.white};
    margin: 0 0 5px 0;
    text-align: center;
`;

const LinkHome = styled(Link)`
    font-size: 16px;
    color: ${colors.white};
    font-weight: 600;
    text-decoration: none;
`;

const NotFound = () => {
    return(
        <Header>
            <Title>Not Found</Title>
            <LinkHome to='/'>Back to Home</LinkHome>
        </Header>
    )
}


export default NotFound;