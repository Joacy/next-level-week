import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

interface IBGEUFResponse {
  sigla: string,
};

interface IBGECityResponse {
  nome: string,
};

const Home = () => {
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points');
  }

  const [ufs, setUfs] = useState<string[]>([]);

  async function getUFs() {
    try {
      const response = await axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados");

      const initials = response.data.map(uf => uf.sigla);

      setUfs(initials);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUFs();
  }, []);

  const [selectedUF, setSelectedUF] = useState('0');

  function handleSelectUF(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedUF(e.target.value);
  };

  const [selectedCity, setSelectedCity] = useState('0');

  function handleSelectCity(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(e.target.value);
  };

  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const names = response.data.map(city => city.nome);

        setCities(names);
      });
  }, [selectedUF]);

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      imageStyle={{
        width: 274,
        height: 368,
      }}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />

        <Text style={styles.title}>
          Seu marketplace de coleta de resíduos
        </Text>

        <Text style={styles.description}>
          Ajudamos pessoas a encontrar pontos de coleta de forma eficiente
        </Text>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Feather name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>

          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;