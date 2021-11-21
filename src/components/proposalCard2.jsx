import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import humanFormat from 'human-format';
import {
  Flex,
  Box,
  Button,
  Skeleton,
  Badge,
  Icon,
  Divider,
  Progress,
  Center,
} from '@chakra-ui/react';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDashboard2Line,
  RiDashboard3Line,
} from 'react-icons/ri';
import styled from '@emotion/styled';

import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { format } from 'date-fns';

import { numberWithCommas } from '../utils/general';
import {
  determineProposalStatus,
  getProposalCardDetailStatus,
  memberVote,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import ContentBox from './ContentBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getCustomProposalTerm } from '../utils/metadata';
import { CardLabel, ParaLg, ParaMd, ParaSm } from './typography';
import { getReadableBalance } from '../utils/tokenValue';

const readableNumber = ({ amount, unit, decimals = 1, separator = '' }) => {
  if (!amount || !unit) return null;
  if (amount > 0 && amount < 1) {
    return `${Number(amount.toFixed(4))} ${unit}`;
  }
  return `${humanFormat(amount, {
    unit: ` ${unit}`,
    decimals,
    separator,
  })}`;
};
const readableTokenBalance = tokenData => {
  const { balance, decimals, symbol } = tokenData || {};
  if (!balance || !decimals || !symbol) return null;
  const readableBalance = getReadableBalance(tokenData);
  if (!readableBalance) return null;
  return readableNumber({ amount: readableBalance, unit: symbol });
};

const generateRequestText = proposal => {
  const {
    paymentRequested,
    paymentTokenDecimals,
    paymentTokenSymbol,
    sharesRequested,
    lootRequested,
  } = proposal;
  const paymentReadable = Number(paymentRequested)
    ? readableTokenBalance({
        decimals: paymentTokenDecimals,
        balance: paymentRequested,
        symbol: paymentTokenSymbol,
      })
    : '';

  const sharesReadable = Number(sharesRequested)
    ? readableNumber({ unit: 'Shares', amount: Number(sharesRequested) })
    : '';
  const lootReadable = Number(lootRequested)
    ? readableNumber({ unit: 'Loot', amount: Number(lootRequested) })
    : '';

  return [sharesReadable, lootReadable, paymentReadable]
    .filter(Boolean)
    .join(', ');
};

const generateOfferText = proposal => {
  const { tributeOffered, tributeTokenDecimals, tributeTokenSymbol } = proposal;
  const tributeReadable = Number(tributeOffered)
    ? readableTokenBalance({
        decimals: tributeTokenDecimals,
        balance: tributeOffered,
        symbol: tributeTokenSymbol,
      })
    : '';
  //  'NFT offered' logic here
  const text = [tributeReadable].filter(Boolean).join(', ');
  return text;
};

const checkSpecial = () => {};

const ProposalCardV2 = ({ proposal, customTerms }) => {
  return (
    <ContentBox p='0' mb={4} minHeight='8.875rem'>
      <Flex>
        <PropCardBrief proposal={proposal} />
        <Center height='100%' minHeight='8.875rem'>
          <Divider orientation='vertical' />
        </Center>
        <Flex w='40%'>
          <Box px='1.2rem' py='0.6rem' w='100%'>
            <Flex alignItems='center' mb={3}>
              <Box
                borderRadius='50%'
                background='green'
                h='.6rem'
                w='.6rem'
                mr='2'
              />
              <ParaSm fontWeight='700' mr='1'>
                Passed
              </ParaSm>
              <ParaSm>and needs execution </ParaSm>
            </Flex>
            <Progress value={80} mb='3' colorScheme='secondary.500' />
            <Flex justifyContent='space-between'>
              <Button
                size='sm'
                minW='64px'
                backgroundColor='white'
                color='black'
              >
                No
              </Button>
              <Button
                size='sm'
                minW='64px'
                color='secondary.500'
                variant='outline'
              >
                Abstain
              </Button>
              <Button size='sm' minW='64px'>
                Yes
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

const PropCardBrief = ({ proposal }) => {
  const isOffering = Number(proposal.tributeOffered) > 0;
  return (
    <Flex
      width='60%'
      justifyContent='space-between'
      borderRight='1px solid rgba(255,255,255,0.3)'
    >
      <Box px='1.2rem' py='0.6rem'>
        <CardLabel mb={1}>{proposal.proposalType}</CardLabel>
        <ParaMd fontWeight='700' mb={1}>
          {proposal.title}
        </ParaMd>
        <PropCardRequest proposal={proposal} />
        {isOffering && <PropCardOffer proposal={proposal} />}
      </Box>
      <Box px='1.2rem' py='0.6rem'>
        <Button
          variant='ghost'
          p='0'
          size='sm'
          fontSize='.85rem'
          fontWeight='400'
          color='secondary.400'
          transform='translateY(-.4rem)'
        >
          More Details
        </Button>
      </Box>
    </Flex>
  );
};

const PropCardRequest = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateRequestText(proposal);
    }
  }, [proposal]);
  return (
    <Flex alignItems='center'>
      <RiArrowLeftLine size='1.2rem' />
      <ParaMd mr='1' ml='1'>
        Requesting
      </ParaMd>
      <ParaMd fontWeight='700'>{requestText}</ParaMd>
    </Flex>
  );
};

const PropCardOffer = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateOfferText(proposal);
    }
  }, [proposal]);
  return (
    <Flex alignItems='center'>
      <RiArrowRightLine size='1.2rem' />
      <ParaMd mx='1'>Offering</ParaMd>
      <ParaMd fontWeight='700'>{requestText}</ParaMd>
    </Flex>
  );
};

export default ProposalCardV2;
