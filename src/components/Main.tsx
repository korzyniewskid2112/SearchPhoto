import { useEffect, useState } from 'react';
import styled from 'styled-components';
import background from '../assets/back.jpg';
import {Link} from 'react-router-dom';
import {colors} from '../constants/colors';
import {api} from '../constants/api';
import { BiSearch } from 'react-icons/bi';
import { IoIosClose, IoMdArrowRoundForward } from 'react-icons/io';


interface topLinksProps {
    id: string,
    slug: string,
    title: string,
}

interface suggestionProps{
    total: number,
    total_pages: number,
    results: Array<{
        id: string, 
        title: string,
    }>,
}

interface FormContainerSuggestionProps {
    active: boolean,
}

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
`;

const SubTitle = styled.p`
    font-weight: 300;
    font-size: 18px;
    color: ${colors.white};
    margin: 0 0 25px 0;
    text-align: center;
`;

const SearchContainer = styled.div`
    width: 60%;
`;

const FormContainer = styled.form`
    margin: 0 0 25px 0;
    position: relative;
`;

const TopLinksList = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
`;

const TopLinkTitle = styled.div`
    font-size: 14px;
    color: ${colors.white};
    font-weight: 600;
    margin-right: 15px;
`;

const TopLink = styled(Link)`
    font-size: 12px;
    color: ${colors.white};
    font-weight: 400;
    margin-right: 15px;
    text-decoration: none;
    position: relative;
    &:hover{
        &::after{
            width: 100%;
        }
    }
    &::after{
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        width: 0;
        height: 1px;
        margin: 0 auto;
        background-color: ${colors.white};
        transition: all .1s ease-in;
    }
`;

const FormContainerSearch = styled.div`
    background-color: ${colors.white};
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: 40px auto 40px;
    align-items: center;
`;

const FormSearchInput = styled.input`
    border: none;
    font-size: 16px;
    padding: 10px 0;
    font-weight: 300;
    outline: none;
`;

const ButtonRemoveSearch = styled.button`
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormContainerSuggestion = styled.ul<FormContainerSuggestionProps>`
    position: absolute;
    top: 55px;
    left: 0;
    right: 0;
    background-color: ${colors.white};
    border-radius: 5px;
    overflow: hidden;
    padding: 15px;
    margin: 0;
    list-style: none;
    z-index: 9999;
    transition: all .3s ease-in;
    visibility: ${props => props.active ? 'visible' : 'hidden'};
    opacity: ${props => props.active ? 1 : 0};
`;

const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Main = () => {

    const [searchText, setSearchText] = useState<string>('');
    const [topLinks, setTopLinks] = useState<Array<topLinksProps>>([]);
    const [suggestionLinks, setSuggestionLinks] = useState<suggestionProps>({total: 0, total_pages: 0, results: []});

    const getTopLinks = async () => {
        await fetch(api.link+'topics/?'+new URLSearchParams({client_id: api.apiKey, order_by: 'featured', per_page: '10'}))
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(response => setTopLinks(response))
        .catch( _ => console.log(_));
    }


    const getSuggestion = async (suggestion: string) => {
        setSearchText(suggestion);
        // if(suggestion.length >= 3){
        //     await fetch(api.link+'search/collections/?'+new URLSearchParams({client_id: api.apiKey, query: suggestion, per_page: '10'}))
        //     .then(response => {
        //         if (!response.ok) throw Error(response.statusText);
        //         return response.json();
        //     })
        //     .then(response => setSuggestionLinks(response))
        //     .catch( _ => console.log(_));
        // }
    }

    useEffect(() => {
        getTopLinks();
    }, [searchText])

    return(
       <Header>
           <SearchContainer> 
                <Title>Are you looking for some photos?</Title>
                <SubTitle>Write what you want to search, or click links below to check out what's trend right now</SubTitle>
                <FormContainer action={'gallery/'+searchText} >
                    <FormContainerSearch>
                        <IconContainer>
                            <BiSearch size={26} color={colors.gray} />
                        </IconContainer>
                        <FormSearchInput type="text" value={searchText} onChange={response => getSuggestion(response.target.value)} placeholder='what you need?'/>
                        <IconContainer>
                            <ButtonRemoveSearch type='button' onClick={() => setSearchText('')} ><IoIosClose size={34} color={colors.gray} /></ButtonRemoveSearch>
                        </IconContainer>
                    </FormContainerSearch>
                    <FormContainerSuggestion active = {searchText.length > 3 ? true : false}>
                        {suggestionLinks.results.length > 0 
                            ?   suggestionLinks.results.map((object) => (
                                    <li key = {object.id} >{object.title}</li>
                                ))
                            :   topLinks.map((object) => (
                                    <li key = {object.id} >{object.title}</li>
                                ))
                        }
                    </FormContainerSuggestion>
                </FormContainer>  
                {topLinks.length > 0 && (
                    <TopLinksList>
                        <TopLinkTitle>Trending now:</TopLinkTitle>
                        {topLinks.map((object) => (
                            <TopLink key = {object.id} to={'gallery/'+object.slug} >{object.title}</TopLink>
                        ))}
                    </TopLinksList>
                )}
           </SearchContainer>
       </Header>
    )
}


export default Main;