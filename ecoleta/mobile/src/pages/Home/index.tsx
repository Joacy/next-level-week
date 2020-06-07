import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather } from '@expo/vector-icons';
import { Text, View, Image, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

import styles from './styles';

interface IBGEUFResponse {
  sigla: string,
};

interface IBGECityResponse {
  nome: string,
};

const Home = () => {
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUF,
      city: selectedCity,
    });
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
        <RNPickerSelect
          placeholder={{
            label: 'Selecione o estado',
            value: null,
          }}
          items={ufs.map(uf => (
            { label: uf, value: uf }
          ))}
          onValueChange={
            (value) => setSelectedUF(value)
          }
          style={pickerStyle}
          useNativeAndroidPickerStyle={false}
          value={selectedUF}
        />

        <RNPickerSelect
          placeholder={{
            label: 'Selecione a cidade',
            value: null,
          }}
          items={cities.map(city => (
            { label: city, value: city }
          ))}
          onValueChange={
            (value) => setSelectedCity(value)
          }
          style={pickerStyle}
          useNativeAndroidPickerStyle={false}
          value={selectedCity}
        />

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

const pickerStyle = {
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
};

export default Home;