
import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TelaInicial from './src/telas/TelaInicio';
import TelaFavoritos from './src/telas/TelaFavoritos';
import TelaCadastroUsuario from './src/telas/TelaCadastroUsuario';

import { carros as carrosIniciais } from './src/informacoes/carros';
import { Carro } from './src/types/carro';
import { Usuario } from './src/types/Usuario';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const [carros, setCarros] = useState<Carro[]>(carrosIniciais);

  const [dadosCarregados, setDadosCarregados] = useState(false);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

  // Carregar dados salvos
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const carrosSalvos = await AsyncStorage.getItem('@AutoInfo:carros');

        const favoritosSalvos = await AsyncStorage.getItem('@AutoInfo:favoritos');

        const usuariosSalvos = await AsyncStorage.getItem('@AutoInfo:usuarios');

        const usuarioSalvo = await AsyncStorage.getItem(
          '@AutoInfo:usuarioLogado'
        );

        if (usuariosSalvos !== null) {
          setUsuarios(JSON.parse(usuariosSalvos));
        }

        if (usuarioSalvo !== null) {
          setUsuarioLogado(JSON.parse(usuarioSalvo));
        }

        if (carrosSalvos !== null) {
          setCarros(JSON.parse(carrosSalvos));
        }

        if (favoritosSalvos !== null) {
          setFavoritos(JSON.parse(favoritosSalvos));
        }
      } catch (erro) {
        console.log('Erro ao carregar os dados:', erro);
      } finally {
        setDadosCarregados(true);
      }
    };

    carregarDados();
  }, []);

  // Salvar dados
  useEffect(() => {
    if (!dadosCarregados) {
      return;
    }

    const salvarDados = async () => {
      try {
        await AsyncStorage.setItem(
          '@AutoInfo:carros',
          JSON.stringify(carros)
        );

        await AsyncStorage.setItem(
          '@AutoInfo:favoritos',
          JSON.stringify(favoritos)
        );

        await AsyncStorage.setItem(
          '@AutoInfo:usuarios',
          JSON.stringify(usuarios)
        );

        if (usuarioLogado) {
          await AsyncStorage.setItem(
            '@AutoInfo:usuarioLogado',
            JSON.stringify(usuarioLogado)
          );
        } else {
          await AsyncStorage.removeItem('@AutoInfo:usuarioLogado');
        }
      } catch (erro) {
        console.log('Erro ao salvar os dados:', erro);
      }
    };

    salvarDados();
  }, [carros, favoritos, usuarios, usuarioLogado, dadosCarregados]);

  // Carros favoritados
  const carrosFavoritos = carros.filter((carro) =>
    favoritos.includes(carro.modelo)
  );

  // Cadastrar usuário
  const cadastrarUsuario = (novoUsuario: Usuario) => {
    setUsuarios((atuais) => [...atuais, novoUsuario]);
    setUsuarioLogado(novoUsuario);
  };

  // Fazer login
  const fazerLogin = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
  };

  // Fazer logout
  const fazerLogout = () => {
    setUsuarioLogado(null);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Início"
          children={({ navigation }) => (
            <TelaInicial
              favoritos={favoritos}
              setFavoritos={setFavoritos}
              carros={carros}
              setCarros={setCarros}
              usuarioLogado={usuarioLogado}
              onIrParaMinhaConta={() => navigation.navigate('Minha Conta')}
            />
          )}
        />

        <Tab.Screen
          name="Favoritos"
          children={() => (
            <TelaFavoritos
              carrosFavoritos={carrosFavoritos}
              setFavoritos={setFavoritos}
            />
          )}
        />

        <Tab.Screen
          name="Minha Conta"
          children={() => (
            <TelaCadastroUsuario
              usuarios={usuarios}
              usuarioLogado={usuarioLogado}
              onCadastrar={cadastrarUsuario}
              onLogin={fazerLogin}
              onSair={fazerLogout}
            />
          )}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
