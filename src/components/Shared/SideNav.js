import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Text, Stack, Spinner, Link, Box, Flex, Image } from '@chakra-ui/core';

import {
  useDao,
  useLoading,
  useRefetchQuery,
  useTheme,
} from '../../contexts/PokemolContext';
import BrandOverride from '../../assets/themes/raidTheme/raidguild__swords.svg';
import { PrimaryButton, SecondaryButton } from '../../themes/theme';
import ChangeDao from './ChangeDao';

const SideNav = () => {
  const [loading] = useLoading();
  const [theme, setTheme] = useTheme();
  const [dao] = useDao();
  const history = useHistory();
  const [, updateRefetchQuery] = useRefetchQuery();

  console.log('dao', dao);

  const setLocalTheme = () => {
    setTheme({
      brand50: '#ff4d74',
      brand100: '#ff4d74',
      brand200: '#ff4d74',
      brand300: '#ff4d74',
      brand400: '#fe1d5b',
      brand500: '#e50651',
      brand600: '#e50651',
      brand700: '#e50651',
      brand800: '#e50651',
      brand900: '#e50651',
      brandImg: BrandOverride,
      bg400: '#000',
      primaryFont: 'Syne Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Players',
        member: 'Player',
      },
    });
  };

  const setDefault = () => {
    setTheme();
  };

  return (
    <Box>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {dao ? (
            <>
              <Flex direction='row' justify='start' align='start'>
                <Flex direction='column' align='center' justify='start' mr={6}>
                  <Link as={RouterLink} to={`/dao/${dao.address}`}>
                    <Image src={theme.images.brandImg} size='60px' />
                  </Link>
                </Flex>
                <Flex direction='column' align='start' justify='start'>
                  <Link
                    as={RouterLink}
                    to={`/dao/${dao.address}`}
                    fontSize='xl'
                  >
                    {dao.name}
                  </Link>
                  <ChangeDao />
                </Flex>
              </Flex>
              <Stack spacing={3} mt='125px' w='200px' pr={1}>
                <Text
                  fontSize='xs'
                  fontFamily={theme.fonts.heading}
                  cursor='pointer'
                  onClick={() => history.push('/')}
                >
                  Main Menu
                </Text>
                <Link to={`/dao/${dao.address}/proposals`} as={RouterLink}>
                  <Text fontSize='2xl' fontFamily={theme.fonts.heading}>
                    {theme.daoMeta.proposals}
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/bank`} as={RouterLink}>
                  <Text fontSize='2xl' fontFamily={theme.fonts.heading}>
                    {theme.daoMeta.bank}
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/members`} as={RouterLink}>
                  <Text fontSize='2xl' fontFamily={theme.fonts.heading}>
                    {theme.daoMeta.members}
                  </Text>
                </Link>
                <Link
                  to={`/dao/${dao.address}/settings/boosts`}
                  as={RouterLink}
                >
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Boost
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/settings`} as={RouterLink}>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Settings
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/profile`} as={RouterLink}>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Stats
                  </Text>
                </Link>
              </Stack>
              <Flex mt={10} direction='column' w='60%'>
                <PrimaryButton onClick={setDefault} mb={3}>
                  Default
                </PrimaryButton>
                <SecondaryButton onClick={setLocalTheme}>Other</SecondaryButton>
              </Flex>
            </>
          ) : (
            <>
              <Flex direction='row' justify='start' align='start'>
                <Flex direction='column' align='center' justify='start' mr={6}>
                  <Link as={RouterLink} to={`/`}>
                    <Image src={theme.images.brandImg} size='60px' />
                  </Link>
                </Flex>
                <Flex direction='column' align='start' justify='start'>
                  <Link as={RouterLink} to={`/`} fontSize='xl'>
                    DAOhaus
                  </Link>
                  <ChangeDao />
                </Flex>
              </Flex>
              <Stack spacing={4} mt='125px' w='200px' pr={1}>
                <Text fontSize='xs'>Main Menu</Text>
                <Link href='https://daohaus.club' isExternal>
                  <Text fontSize='xl' fontFamily={theme.fonts.heading}>
                    Explore DAOs
                  </Text>
                </Link>
                <Link href='https://daohaus.club/summon' isExternal>
                  <Text fontSize='xl' fontFamily={theme.fonts.heading}>
                    Summon a DAO
                  </Text>
                </Link>
                <Link
                  href='https://xdai.daohaus.club/dao/v2/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50'
                  isExternal
                >
                  <Text fontSize='xl' fontFamily={theme.fonts.heading}>
                    HausDAO
                  </Text>
                </Link>
                <Link href='https://daohaus.club/about' isExternal>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    About
                  </Text>
                </Link>
                <Link href='https://daohaus.club/help' isExternal>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Help
                  </Text>
                </Link>
              </Stack>
              <Flex mt={10} direction='column' w='60%'>
                <PrimaryButton onClick={setDefault} mb={3}>
                  Default
                </PrimaryButton>
                <SecondaryButton onClick={setLocalTheme}>Other</SecondaryButton>
              </Flex>
            </>
          )}
        </>
      )}

      <SecondaryButton onClick={() => updateRefetchQuery('proposals')}>
        Refetch Proposals Test
      </SecondaryButton>
    </Box>
  );
};

export default SideNav;
