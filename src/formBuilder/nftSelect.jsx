import React, { useEffect, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  Select,
  Image,
  Input,
  AspectRatio,
} from '@chakra-ui/react';
import deepEqual from 'deep-eql';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import FieldWrapper from './fieldWrapper';
import GenericModal from '../modals/genericModal';
import { filterUniqueNfts } from '../utils/nftVaults';
import { fetchErc721s, fetchErc1155s } from '../utils/theGraph';
import { hydrateNfts } from '../utils/nftData';

const NftSelect = props => {
  const { address } = useInjectedProvider();
  const { daoVaults } = useDao();
  const { setGenericModal } = useOverlay();
  const { daochain } = useParams();
  const {
    label,
    localForm,
    htmlFor,
    name,
    localValues,
    source = 'dao',
  } = props;
  const { register, setValue } = localForm;
  const [nftData, setNftData] = useState();
  const [nfts, setNfts] = useState();
  const [selected, setSelected] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    register('tokenId');
    register('tokenBalance');
    register('raribleDescription');
    register('image');
    register('nftType');
    register('selectedMinion');
    register('selectedSafeAddress');

    if (source === 'user') {
      fetchErc721s({ address, chainID: daochain })
        .then(async res => {
          const data = await hydrateNfts(res.tokens, 'ERC-721');
          setNftData(data);
          setNfts(data);
        })
        .catch(err => console.log(err));
      fetchErc1155s({ address, chainID: daochain })
        .then(res => {
          console.log('1155s: ', res);
        })
        .catch(err => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (nfts) {
      setCollections(
        nfts.reduce((acc, item) => {
          if (acc.indexOf(item.name) === -1) {
            return [...acc, item.name];
          }
          return acc;
        }, []),
      );
    }
  }, [nfts]);

  useEffect(() => {
    if (daoVaults /* && source === 'dao' */) {
      const data = filterUniqueNfts(daoVaults, localValues?.minionAddress);
      console.log(data);
      // setNftData(data);
      // setNfts(data);
    }
  }, [daoVaults]);

  useEffect(() => {
    if (nftData && filter) {
      const filtered = nftData.filter(item => {
        if (filter !== '') {
          return filter === item.name;
        }
        return true;
      });
      if (!deepEqual(filtered, nfts)) {
        setNfts(filtered);
      }
    }
  }, [filter, nfts]);

  useEffect(() => {
    const setUpNftValues = async () => {
      console.log('selected', selected);
      setValue(name, selected.contractAddress);
      setValue('tokenId', selected.tokenId);
      setValue('tokenBalance', selected.tokenBalance);
      setValue(
        'raribleDescription',
        `Selling ${selected.metadata?.name || selected.name} tokenId ${
          selected.tokenId
        }`,
      );
      setValue(
        'image',
        // selected.metadata?.image_url || selected.metadata?.image,
        selected.image,
      );
      setValue('nftType', selected.type.replace('-', ''));
      setValue('selectedMinion', selected.minionAddress);
      setValue('selectedSafeAddress', selected.safeAddress);
    };
    if (selected) {
      setUpNftValues();
    }
  }, [selected]);

  useEffect(() => {
    if (
      localValues &&
      localValues.tokenId &&
      localValues.contractAddress &&
      nfts
    ) {
      setSelected(
        nfts.find(
          item =>
            item.tokenId === localValues.tokenId &&
            item.contractAddess === localValues.contractAddess,
        ),
      );
    }
  }, [localValues, nfts]);

  const openModal = () => {
    setGenericModal({ nftSelect: true });
  };

  const selectNft = e => {
    const nft = nfts[e.nativeEvent.target.value];
    setGenericModal({});
    setSelected(nft);
  };

  const onFilterChange = e => setFilter(e.nativeEvent.target.value);

  const selectModal = (
    <GenericModal closeOnOverlayClick modalId='nftSelect'>
      <Box>
        <Box
          fontFamily='heading'
          textTransform='uppercase'
          fontSize='xs'
          fontWeight={700}
          color='#7579C5'
          mb={4}
        >
          Select An NFT
        </Box>
        <Select placeholder='Filter by Collection' onChange={onFilterChange}>
          {collections?.map(collection => (
            <option value={collection} key={collection}>
              {collection}
            </option>
          ))}
        </Select>
        {nfts?.map((nft, i) => (
          <Box key={i} mt={5}>
            <Flex mb={5} alignItems='center' justify='space-between'>
              <Text textTransform='uppercase' fontFamily='header'>
                {nft.metadata.name}
              </Text>
              <Button value={i} onClick={selectNft}>
                Select
              </Button>
            </Flex>
            <Image src={nft.image} />
          </Box>
        ))}
      </Box>
    </GenericModal>
  );

  return (
    <FieldWrapper>
      <Input type='hidden' id={htmlFor} name={name} ref={register} />
      <Box>
        <Text mb={3}>{label}</Text>
        <AspectRatio
          ratio={1}
          width='100%'
          className='aspect-box'
          sx={{
            '&>img': {
              objectFit: 'contain',
            },
          }}
        >
          {selected ? (
            <Image
              onClick={openModal}
              _hover={{
                opacity: 0.5,
                cursor: 'pointer',
              }}
              src={selected.image}
            />
          ) : (
            <Button variant='nftSelect' onClick={openModal}>
              <Icon w={50} h={50} color='primary.500' as={RiAddFill} />
            </Button>
          )}
        </AspectRatio>
      </Box>
      {selectModal}
    </FieldWrapper>
  );
};

export default NftSelect;
