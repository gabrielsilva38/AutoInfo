
import React from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  Share,
  Linking,
  Alert,
} from 'react-native';

import { Carro } from '../types/carro';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

type Props = {
  carro: Carro;
  onVoltar: () => void;
};

export default function DetalhesCarro({
  carro,
  onVoltar,
}: Props) {

  // Converte a foto do veículo para Base64
  const obterFotoBase64 = async () => {
    if (!carro.foto) {
      return '';
    }

    let uri: string;

    if (typeof carro.foto === 'number') {
      const imagem = Asset.fromModule(carro.foto);
      await imagem.downloadAsync();
      uri = imagem.localUri || imagem.uri;
    } else {
      uri = carro.foto;
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const extensao = uri.split('?')[0].split('.').pop()?.toLowerCase();

    const tipoImagem = extensao === 'png'
      ? 'image/png'
      : 'image/jpeg';

    return `data:${tipoImagem};base64,${base64}`;
  };

  const abrirLinkCarro = async () => {
  try {
    const pesquisa = encodeURIComponent(
      `${carro.marca} ${carro.modelo} ${carro.ano}`
    );

    const link = `https://www.google.com/search?q=${pesquisa}`;

    await Linking.openURL(link);

  } catch (erro) {
    Alert.alert(
      'Erro',
      'Não foi possível abrir o link do veículo.'
    );
  }
};

  // Gera e compartilha o PDF
  const gerarPDF = async () => {
    try {
      Alert.alert('Gerando PDF', 'Aguarde enquanto preparamos o documento.');

      const fotoBase64 = await obterFotoBase64();

      const html = `
        <html>
          <body style="font-family: Arial; padding: 25px; color: #172B4D;">

            <h1 style="text-align: center;">AUTOINFO</h1>

            <h2>${carro.marca} ${carro.modelo}</h2>

            <p style="color: #666;">Ano: ${carro.ano}</p>

            ${
              fotoBase64
                ? `<img src="${fotoBase64}"
                     style="width: 100%; height: 250px; object-fit: contain;" />`
                : '<p>Foto não disponível</p>'
            }

            <h3>Especificações do veículo</h3>

            <p><strong>Cor:</strong> ${carro.cor}</p>
            <p><strong>Combustível:</strong> ${carro.tipoCombustivel}</p>
            <p><strong>Motor:</strong> ${carro.tipoMotor}</p>
            <p><strong>Potência:</strong> ${carro.potencia} cv</p>
            <p><strong>Consumo na cidade:</strong> ${carro.consumoCidade} km/l</p>
            <p><strong>Consumo na estrada:</strong> ${carro.consumoEstrada} km/l</p>
            <p><strong>Velocidade máxima:</strong> ${carro.velocidadeMaxima} km/h</p>

          </body>
        </html>
      `;

      // Cria o arquivo PDF
      const arquivo = await Print.printToFileAsync({
        html,
      });
      console.log('PDF GERADO:', arquivo.uri);

const informacoesArquivo = await FileSystem.getInfoAsync(arquivo.uri);

console.log('INFORMAÇÕES DO PDF:', informacoesArquivo);

      // Verifica se o compartilhamento está disponível
      const disponivel = await Sharing.isAvailableAsync();

      if (!disponivel) {
        Alert.alert(
          'PDF gerado',
          'O documento foi criado, mas o compartilhamento não está disponível neste dispositivo.'
        );
        return;
      }

      // Compartilha diretamente o arquivo criado
      await Sharing.shareAsync(arquivo.uri, {
  mimeType: 'application/pdf',
  dialogTitle: 'Compartilhar veículo',
});

    } catch (erro) {
      console.log('Erro ao gerar PDF:', erro);

      Alert.alert(
        'Erro ao gerar PDF',
        'Não foi possível gerar ou compartilhar o documento. Verifique o console para mais detalhes.'
      );
    }
  };

  // Compartilha as informações em texto
  const compartilharCarro = async () => {
    try {
      await Share.share({
        message: `
🚗 AUTOINFO - VEÍCULO

Marca: ${carro.marca}
Modelo: ${carro.modelo}
Ano: ${carro.ano}
Cor: ${carro.cor}

Combustível: ${carro.tipoCombustivel}
Motor: ${carro.tipoMotor}
Potência: ${carro.potencia} cv

Consumo na cidade: ${carro.consumoCidade} km/l
Consumo na estrada: ${carro.consumoEstrada} km/l

Velocidade máxima: ${carro.velocidadeMaxima} km/h
        `,
      });
    } catch (erro) {
      console.log('Erro ao compartilhar veículo:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível compartilhar as informações do veículo.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>
        {carro.marca} {carro.modelo}
      </Text>

      <Text style={styles.subtitulo}>
        Ano {carro.ano}
      </Text>

      {carro.foto ? (
        <Image
          source={
            typeof carro.foto === 'string'
              ? { uri: carro.foto }
              : carro.foto
          }
          style={styles.foto}
          resizeMode="contain"
        />
      ) : (
        <Text>Foto não disponível</Text>
      )}

      <View style={styles.grade}>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>ANO</Text>
          <Text style={styles.valor}>{carro.ano}</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>COR</Text>
          <Text style={styles.valor}>{carro.cor}</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>COMBUSTÍVEL</Text>
          <Text style={styles.valor}>{carro.tipoCombustivel}</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>MOTOR</Text>
          <Text style={styles.valor}>{carro.tipoMotor}</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>POTÊNCIA</Text>
          <Text style={styles.valor}>{carro.potencia} cv</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>CONSUMO NA CIDADE</Text>
          <Text style={styles.valor}>{carro.consumoCidade} km/l</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>CONSUMO NA ESTRADA</Text>
          <Text style={styles.valor}>{carro.consumoEstrada} km/l</Text>
        </View>

        <View style={styles.cartaoInfo}>
          <Text style={styles.rotulo}>VELOCIDADE MÁXIMA</Text>
          <Text style={styles.valor}>{carro.velocidadeMaxima} km/h</Text>
        </View>

      </View>

      <Button
        title="Compartilhar informações"
        onPress={compartilharCarro}
        color="#526A91"
      />

      <View style={{ height: 10 }} />

      <Button
        title="Ver veículo na internet"
        onPress={abrirLinkCarro}
        color="#172B4D"
      />

      <View style={{ height: 10 }} />

      <Button
        title="Voltar ao catálogo"
        onPress={onVoltar}
        color="#172B4D"
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2F4F7',
    padding: 20,
    paddingTop: 40,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#172B4D',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 16,
    color: '#7A8494',
    textAlign: 'center',
    marginBottom: 20,
  },

  foto: {
    width: '100%',
    height: 240,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  cartaoInfo: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  rotulo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7A8494',
    marginBottom: 8,
  },

  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172B4D',
  },
});
