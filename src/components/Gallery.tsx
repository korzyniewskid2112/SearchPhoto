import { useEffect, useState } from 'react';
import styled from 'styled-components';
import background from '../assets/back.jpg';
import {api} from '../constants/api';
import {colors} from '../constants/colors';
import { useParams} from 'react-router-dom';
import InputContainer from './InputContainer';
import {AiFillHeart} from 'react-icons/ai';
import Modal from 'react-modal';
import { IoIosClose } from 'react-icons/io';

interface photosProps {
    total: number,
    total_pages: number,
    results: Array<{id: string, likes: number, urls: {regular: string, full: string}, user: {username: string, location: string}}>,
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

const SearchContainer = styled.div`
    width: 60%;
    padding: 0 30px;
    @media(max-width: 992px){
        width: 100%;
    }
`;

const GalleryList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 25px;
    grid-auto-rows: 350px;
    max-width: 1500px;
    margin: 0 auto;
    padding: 30px 30px;
    @media(max-width: 992px){
        grid-template-columns: repeat(2, 1fr);
    }
    @media(max-width: 500px){
        grid-template-columns: repeat(1, 1fr);
    }
`;

const ButtonPhoto = styled.button`
    border-radius: 5px;
    overflow: hidden;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    position: relative;
`;

const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Likes = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: ${colors.white};
    border-radius: 20px;
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LikesText = styled.span`
    font-size: 12px;
    font-weight: 500;
    margin-right: 5px;
    color: ${colors.black};
`;

const LoadingOrNotFound = styled.div`
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    color: ${colors.black};
    padding: 40px 0;
`;

const CloseContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 2px solid ${colors.white};
`;

const CloseButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    background: none;
    cursor: poiner;
`;

const PhotoInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PhotoInfoText = styled.p`
    padding: 0;
    font-size: 14px;
    color: ${colors.black};
    font-weight: 600;
`;

const PhotoSrc = styled.img`
    width: 100%;
    height: auto;
`;

const Gallery = () => {

    const {slug} = useParams();
    const [photos, setPhotos] = useState<photosProps>({total: 0, total_pages: 0, results: []});
    const [photosLoading, setPhotosLoading] = useState<boolean>(true);
    const [modalInfo, setModalInfo] = useState<{photo: string, owner: string, loc: string}>({photo: '', owner: '', loc: ''});

    
    const [modalIsOpen, setIsOpen] = useState(false);

    const closeModal = () => {
      setIsOpen(false);
    }

    const handleShowPhoto = (photo: string, owner: string, loc: string) => {
        setModalInfo((prevState) => ({...prevState, photo: photo, owner: owner, loc: loc}));
        setIsOpen(true);
    }

    useEffect(() => {
        const getPhotosBySlug = async () => {
            if(slug && slug.length > 0){
                await fetch(api.link+'search/photos/?'+new URLSearchParams({client_id: api.apiKey, query: slug, per_page: '40' ,page: '1'}))
                .then(response => {
                    if (!response.ok) throw Error(response.statusText);
                    return response.json();
                })
                .then(response => setPhotos(response))
                .catch( _ => console.log(_))
            }
            setPhotosLoading(false);
        }
        getPhotosBySlug();
    }, [slug]);

    return(
        <>
            <Header>
                <SearchContainer> 
                 <Title>This is what we found for you</Title>
                 <InputContainer slug = {slug && slug.length > 0 ? slug.replaceAll('-', " ") : ''}/>
                </SearchContainer>
            </Header>
            {!photosLoading 
                ?   photos.results.length > 0
                        ?   <GalleryList>
                                {photos?.results.map((object) => (
                                   <ButtonPhoto onClick={() => handleShowPhoto(object.urls.full, object.user.username, object.user.location)} key = {object.id}>
                                       <Likes>
                                            <LikesText>{object.likes}</LikesText>
                                            <AiFillHeart size = {15}/>
                                       </Likes>
                                       <Photo src={object.urls.regular} />
                                   </ButtonPhoto>
                                ))}
                            </GalleryList>
                        :   <LoadingOrNotFound>Not found</LoadingOrNotFound>
                :   <LoadingOrNotFound>Loading...</LoadingOrNotFound>
            }
             <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <CloseContainer>
                    <CloseButton onClick={() => closeModal()}><IoIosClose size={40} color={colors.black} /></CloseButton>
                </CloseContainer>
                <PhotoInfo>
                    <PhotoInfoText>Owner: {modalInfo.owner}</PhotoInfoText>
                    <PhotoInfoText>Location: {modalInfo.loc}</PhotoInfoText>
                </PhotoInfo>
                <PhotoSrc src={modalInfo.photo} />
            </Modal>
        </>
    )

}

export default Gallery;