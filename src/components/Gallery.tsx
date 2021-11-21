import { useEffect, useState } from 'react';
import styled from 'styled-components';
import background from '../assets/back.jpg';
import {api} from '../constants/api';
import {colors} from '../constants/colors';
import { useParams} from 'react-router-dom';


interface photosProps {
    total: number,
    total_pages: number,
    results: Array<{id: string, likes: number, urls: {regular: string, full: string}}>,
}

const Header = styled.header`
height: auto;
width: 100%;
padding: 40px 0;
background: url(${background});
background-size: cover;
background-position: 'center center';
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 50px;
`;

const Title = styled.h3`
font-weight: 800;
font-size: 28px;
color: ${colors.white};
margin: 0 0 5px 0;
text-align: center;
`;

const SearchContainer = styled.div`
width: 60%;
`;

const GalleryList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 25px;
    grid-auto-rows: 350px;
    max-width: 1500px;
    margin: 0 auto 60px auto;
`;

const ButtonPhoto = styled.button`
    border-radius: 5px;
    overflow: hidden;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
`;

const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;



const Gallery = () => {

    const {slug} = useParams<'slug'>();
    const [photos, setPhotos] = useState<photosProps>();
    
    const getPhotosBySlug = async () => {
        if(slug && slug.length > 0){
            await fetch(api.link+'search/photos/?'+new URLSearchParams({client_id: api.apiKey, query: slug, per_page: '21'}))
            .then(response => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then(response => setPhotos(response));
        } 
    }

    useEffect(() => {
        getPhotosBySlug();
    }, []);


    return(
        <>
            <Header>
                <SearchContainer> 
                 <Title>This is what we found for you</Title>
                
                 {/* <FormContainer action='search-image?text={searchText}' >
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
                        <li>
                            <Link to='' style = {{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Wallpapaer</span>
                                <IoMdArrowRoundForward size = {22} />
                            </Link>
                        </li>
                    </FormContainerSuggestion>
                 </FormContainer>   */}
                </SearchContainer>

                
            </Header>
            <GalleryList>
                        {photos?.results.map((object) => (
                           <ButtonPhoto key = {object.id}>
                               <Photo src={object.urls.regular} />
                           </ButtonPhoto>
                        ))}
                    
                    
                </GalleryList>
            
        </>
    )

}

export default Gallery;