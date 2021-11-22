import {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {colors} from '../constants/colors';
import {api} from '../constants/api';
import { BiSearch } from 'react-icons/bi';
import { IoIosClose, IoMdArrowRoundForward } from 'react-icons/io';

interface FormContainerSuggestionProps {
    active: boolean,
}
interface BorderBottomProps {
    border: boolean,
}

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


const IconContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
`;

const SuggestionLink = styled(Link)<BorderBottomProps>`
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 0;
font-size: 16px;
font-weight: 300;
color: ${colors.black};
border-bottom: ${props => props.border ? '1px' : '0'} solid ${colors.gray};
text-decoration: none;
`;


const FormContainerSearch = styled.div`
    background-color: ${colors.white};
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: 40px auto 40px;
    align-items: center;
    margin-bottom: 20px;
`;

const FormSearchInput = styled.input`
    border: none;
    font-size: 16px;
    padding: 10px 0;
    font-weight: 300;
    outline: none;
    width: 100%;
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
    padding: 5px 15px;
    margin: 0;
    list-style: none;
    z-index: 9999;
    transition: all .3s ease-in;
    visibility: ${props => props.active ? 'visible' : 'hidden'};
    opacity: ${props => props.active ? 1 : 0};
    box-shadow: -28px 45px 34px -18px rgba(0, 0, 0, 1);
`;

const FormContainer = styled.form`
    margin: 0 0 25px 0;
    position: relative;
`;

const SuggestionNotFound = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${colors.black};
    text-align: center;
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

const InputContainer = ({slug} : {slug: string}) => {

    const [searchText, setSearchText] = useState<string>('');
    const [suggestionLinks, setSuggestionLinks] = useState<suggestionProps>({total: 0, total_pages: 0, results: []});
    const [checkFocus, setCheckFocus] = useState<boolean>(false);

    const getSuggestion = async (suggestion: string) => {
        setSearchText(suggestion);
        if(suggestion.length >= 3){
            await fetch(api.link+'search/collections/?'+new URLSearchParams({client_id: api.apiKey, query: suggestion, per_page: '5'}))
            .then(response => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then(response => setSuggestionLinks(response))
            .catch( _ => console.log(_));
        }
    }

    const [topLinks, setTopLinks] = useState<Array<topLinksProps>>([]);

    const getTopLinks = async () => {
        await fetch(api.link+'topics/?'+new URLSearchParams({client_id: api.apiKey, order_by: 'featured', per_page: '5'}))
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(response => setTopLinks(response))
        .catch( _ => console.log(_));
    }

    useEffect(() => {
        if(slug && slug.length > 0){
            setSearchText(slug.replaceAll('-', ' '));
        }
        getTopLinks();
        return(() => {
            setSearchText('');
        })
    }, [slug])

    return (
        <FormContainer action={`/gallery/${searchText.replaceAll(/\s/g, "-")}`}>
        <FormContainerSearch>
            <IconContainer>
                <BiSearch size={26} color={colors.gray} />
            </IconContainer>
            <FormSearchInput onFocus={() => { setCheckFocus(true); getSuggestion(searchText);}} onBlur={() => setCheckFocus(false)} type="text" value={searchText} onChange={response => getSuggestion(response.target.value)} placeholder='what you need?'/>
            <IconContainer>
                <ButtonRemoveSearch type='button' onClick={() => setSearchText('')} ><IoIosClose size={34} color={colors.gray} /></ButtonRemoveSearch>
            </IconContainer>
        </FormContainerSearch>
        <FormContainerSuggestion active = {checkFocus}>
            {suggestionLinks.results.length > 0 
                ?   suggestionLinks.results.map((object, i) => (
                        <li key = {object.id} >
                            <SuggestionLink to = {`/gallery/${object.title.replaceAll(/\s/g, "-")}`} border = {suggestionLinks.results.length -1 !== i ? true : false}>
                                {object.title}
                                <IoMdArrowRoundForward  size = {20} color = {colors.black} />
                            </SuggestionLink>
                        </li>
                    ))
                :   <>
                        <SuggestionNotFound>No results</SuggestionNotFound>
                    </>
                
            }
        </FormContainerSuggestion>
            {topLinks.length > 0 && (
                <TopLinksList>
                    <TopLinkTitle>Trending now:</TopLinkTitle>
                    {topLinks.map((object) => (
                        <TopLink key = {object.id} to={`/gallery/${object.slug}`}>{object.title}</TopLink>
                    ))}
                </TopLinksList>
            )}
        </FormContainer>  
    )
}

export default InputContainer;