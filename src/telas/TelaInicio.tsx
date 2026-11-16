
import React, { useState } from 'react';
import { Carro } from '../types/carro';
import CardCarro from '../componentes/CardCarro';
import * as ImagePicker from 'expo-image-picker';
import DetalhesCarro from '../componentes/DetalhesCarro';
import { Usuario } from '../types/Usuario';

import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

type Props = {
  favoritos: string[];
  setFavoritos: React.Dispatch<React.SetStateAction<string[]>>;
  carros: Carro[];
  setCarros: React.Dispatch<React.SetStateAction<Carro[]>>;
  usuarioLogado: Usuario | null;
  onIrParaMinhaConta: () => void;
};

export default function TelaInicial({
  favoritos,
  setFavoritos,
  carros,
  setCarros,
  usuarioLogado,
  onIrParaMinhaConta,
}: Props) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [busca, setBusca] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [carroSelecionado, setCarroSelecionado] = useState<Carro | null>(null);

  const verDetalhes = (carro: Carro) => {
    setCarroSelecionado(carro);
  };

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [consumoCidade, setConsumoCidade] = useState('');
  const [consumoEstrada, setConsumoEstrada] = useState('');
  const [tipoCombustivel, setTipoCombustivel] = useState('');
  const [tipoMotor, setTipoMotor] = useState('');
  const [potencia, setPotencia] = useState('');
  const [velocidadeMaxima, setVelocidadeMaxima] = useState('');

  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Verificar se o usuário está logado
  const verificarLogin = () => {
    if (usuarioLogado === null) {
      Alert.alert(
        'Faça login',
        'Entre na sua conta ou crie um cadastro para utilizar esta funcionalidade.',
        [
          {
            text: 'Agora não',
            style: 'cancel',
          },
          {
            text: 'Ir para Minha Conta',
            onPress: onIrParaMinhaConta,
          },
        ]
      );

      return false;
    }

    return true;
  };

  // Abrir formulário de cadastro
  const abrirFormularioCadastro = () => {
    if (!verificarLogin()) {
      return;
    }

    setMostrarFormulario(!mostrarFormulario);
    setMensagemErro('');
    setMensagemSucesso('');
  };

  // Favoritar ou remover dos favoritos
  const favoritarCarro = (modeloCarro: string) => {
    if (!verificarLogin()) {
      return;
    }

    setFavoritos((atuais) =>
      atuais.includes(modeloCarro)
        ? atuais.filter((modelo) => modelo !== modeloCarro)
        : [...atuais, modeloCarro]
    );
  };

  const carrosFiltrados = carros.filter((carro) => {
    const nomeCarro = `${carro.marca} ${carro.modelo} ${carro.ano}`;

    return nomeCarro
      .toLowerCase()
      .includes(busca.toLowerCase());
  });

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
      setMensagemErro('');
    }
  };

  const tirarFoto = async () => {
    const permissao =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      setMensagemErro(
        'Precisamos de permissão para acessar a câmera!'
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
      setMensagemErro('');
    }
  };

  const adicionarCarro = () => {
    if (!verificarLogin()) {
      return;
    }

    if (
      !marca.trim() ||
      !modelo.trim() ||
      !ano.trim() ||
      !cor.trim() ||
      !consumoCidade.trim() ||
      !consumoEstrada.trim() ||
      !tipoCombustivel.trim() ||
      !tipoMotor.trim() ||
      !potencia.trim() ||
      !velocidadeMaxima.trim()
    ) {
      setMensagemErro(
        'Preencha todos os campos antes de cadastrar o carro.'
      );
      return;
    }

    if (!Number.isFinite(Number(ano)) || Number(ano) <= 0) {
      setMensagemErro('Digite um ano válido.');
      return;
    }

    if (
      !Number.isFinite(Number(consumoCidade)) ||
      Number(consumoCidade) <= 0 ||
      !Number.isFinite(Number(consumoEstrada)) ||
      Number(consumoEstrada) <= 0 ||
      !Number.isFinite(Number(potencia)) ||
      Number(potencia) <= 0 ||
      !Number.isFinite(Number(velocidadeMaxima)) ||
      Number(velocidadeMaxima) <= 0
    ) {
      setMensagemErro(
        'Consumo, potência e velocidade devem ser números maiores que zero.'
      );
      return;
    }

    const novoCarro: Carro = {
      marca,
      modelo,
      ano: Number(ano),
      cor,
      foto: foto,
      consumoCidade: Number(consumoCidade),
      consumoEstrada: Number(consumoEstrada),
      tipoCombustivel: tipoCombustivel as Carro['tipoCombustivel'],
      tipoMotor: tipoMotor as Carro['tipoMotor'],
      potencia: Number(potencia),
      velocidadeMaxima: Number(velocidadeMaxima),
    };

    setCarros((atuais) => [...atuais, novoCarro]);

    setMensagemErro('');

    setMarca('');
    setModelo('');
    setAno('');
    setCor('');
    setConsumoCidade('');
    setConsumoEstrada('');
    setTipoCombustivel('');
    setTipoMotor('');
    setPotencia('');
    setVelocidadeMaxima('');
    setFoto(null);

    setMensagemSucesso('Carro adicionado com sucesso!');
    setMostrarFormulario(false);
  };

  if (carroSelecionado) {
    return (
      <DetalhesCarro
        carro={carroSelecionado}
        onVoltar={() => setCarroSelecionado(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={carrosFiltrados}
        numColumns={2}
        keyExtractor={(item, index) =>
          `${item.marca}-${item.modelo}-${item.ano}-${index}`
        }
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>AutoInfo</Text>

            <Text style={styles.subtitulo}>
              Encontre informações sobre o seu carro.
            </Text>

            <Button
              title={
                mostrarFormulario
                  ? 'Cancelar cadastro'
                  : 'Cadastrar novo carro'
              }
              onPress={abrirFormularioCadastro}
            />

            {mostrarFormulario && (
              <View style={styles.formulario}>
                <Text style={styles.tituloFormulario}>
                  Cadastro de veículo
                </Text>

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Marca do carro"
                  placeholderTextColor="#7A8494"
                  value={marca}
                  onChangeText={setMarca}
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Modelo do carro"
                  placeholderTextColor="#7A8494"
                  value={modelo}
                  onChangeText={setModelo}
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Ano do carro"
                  placeholderTextColor="#7A8494"
                  value={ano}
                  onChangeText={setAno}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Cor do carro"
                  placeholderTextColor="#7A8494"
                  value={cor}
                  onChangeText={setCor}
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Consumo na cidade (km/l)"
                  placeholderTextColor="#7A8494"
                  value={consumoCidade}
                  onChangeText={setConsumoCidade}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Consumo na estrada (km/l)"
                  placeholderTextColor="#7A8494"
                  value={consumoEstrada}
                  onChangeText={setConsumoEstrada}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Tipo de combustível"
                  placeholderTextColor="#7A8494"
                  value={tipoCombustivel}
                  onChangeText={setTipoCombustivel}
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Tipo de motor"
                  placeholderTextColor="#7A8494"
                  value={tipoMotor}
                  onChangeText={setTipoMotor}
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Potência (cv)"
                  placeholderTextColor="#7A8494"
                  value={potencia}
                  onChangeText={setPotencia}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.campoFormulario}
                  placeholder="Velocidade máxima (km/h)"
                  placeholderTextColor="#7A8494"
                  value={velocidadeMaxima}
                  onChangeText={setVelocidadeMaxima}
                  keyboardType="numeric"
                />

                <Text style={styles.tituloFormulario}>
                  Foto do veículo
                </Text>

                <Button
                  title="Escolher foto da galeria"
                  onPress={escolherFoto}
                />

                <Button
                  title="Tirar foto com a câmera"
                  onPress={tirarFoto}
                />

                {foto !== null && (
                  <Image
                    source={{ uri: foto }}
                    style={styles.fotoVeiculo}
                  />
                )}

                <Button
                  title="Salvar veículo"
                  onPress={adicionarCarro}
                  color="#172B4D"
                />
              </View>
            )}

            {mensagemErro !== '' && (
              <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>
                {mensagemErro}
              </Text>
            )}

            {mensagemSucesso !== '' && (
              <Text style={{ color: 'green', fontWeight: 'bold' }}>
                {mensagemSucesso}
              </Text>
            )}

            <TextInput
              style={styles.pesquisa}
              placeholder="Digite marca, modelo ou ano..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={setBusca}
            />

            {busca !== '' && (
              <Button
                title="Limpar pesquisa"
                onPress={() => setBusca('')}
              />
            )}
          </>
        }
        renderItem={({ item }) => (
          <CardCarro
            carro={item}
            onVerDetalhes={() => verDetalhes(item)}
            estaFavoritado={favoritos.includes(item.modelo)}
            onFavoritar={() => favoritarCarro(item.modelo)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.semResultado}>
            Nenhum veículo encontrado.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 25 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fotoVeiculo: {
    width: 200,
    height: 150,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 15,
  },

  tituloFormulario: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 12,
  },

  
  campoFormulario: {
    backgroundColor: '#FFFFFF',
    color: '#172B4D',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9DEE7',
  },


  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    padding: 20,
    paddingTop: 60,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  subtitulo: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    marginBottom: 25,
  },

  
  pesquisa: {
    backgroundColor: '#FFFFFF',
    color: '#172B4D',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
  },


  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  nomeCarro: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 12,
  },

  informacao: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },

  semResultado: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
});
