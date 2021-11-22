import styled from 'styled-components';
import background from '../assets/back.jpg';
import {colors} from '../constants/colors';
import InputContainer from '../components/InputContainer';

const Header = styled.header`
    height: 100vh;
    width: 100%;
    background: url(${background});
    background-size: cover;
    background-position: 'center center';
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h3`
    font-weight: 800;
    font-size: 28px;
    color: ${colors.white};
    margin: 0 0 5px 0;
    text-align: center;
    @media(max-width: 992px){
        font-size: 20px;
    }
`;

const SubTitle = styled.p`
    font-weight: 300;
    font-size: 18px;
    color: ${colors.white};
    margin: 0 0 25px 0;
    text-align: center;
    @media(max-width: 992px){
        font-size: 12px;
    }
`;

const SearchContainer = styled.div`
    width: 60%;
    padding: 0 30px;
    @media(max-width: 992px){
        width: 100%;
    }
`;



const Main = () => {

    return(
       <Header>
           <SearchContainer> 
                <Title>Are you looking for some photos?</Title>
                <SubTitle>Write what you want to search, or click links below to check out what's trend right now</SubTitle>
                <InputContainer slug = {''} />
           </SearchContainer>
       </Header>
    )
}


export default Main;