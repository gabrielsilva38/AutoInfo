import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
} from 'react-native';
import { Carro } from '../types/carro';

type Props = {
  carro: Carro;
  onFavoritar: () => void;
  onVerDetalhes: () => void;
  estaFavoritado: boolean;
};

export default function CardCarro({
  carro,
  onFavoritar,
  onVerDetalhes,
  estaFavoritado,
}: Props) {
  return (
    <View style={styles.card}>

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
        <View style={styles.semFoto}>
          <Text style={styles.textoSemFoto}>
            Foto não disponível
          </Text>
        </View>
      )}

      <Text style={styles.nomeCarro}>
        {carro.marca} {carro.modelo}
      </Text>

      <View style={styles.informacoes}>
  <Text style={styles.info}>Ano: {carro.ano}</Text>
</View>

<Button
  title="Ver detalhes"
  onPress={onVerDetalhes}
  color="#526A91"
/>

      <Button
        title={
          estaFavoritado
            ? 'Remover dos favoritos'
            : 'Favoritar'
        }
        onPress={onFavoritar}
        color="#172B4D"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  backgroundColor: '#FFFFFF',
  width: '48%',
  padding: 10,
  borderRadius: 12,
  marginBottom: 15,
  marginHorizontal: '1%',
  elevation: 3,
},

  foto: {
  width: '100%',
  height: 170,
  borderRadius: 10,
  marginBottom: 12,
  backgroundColor: '#F2F4F7',
},

  semFoto: {
    width: '100%',
    height: 170,
    backgroundColor: '#E5E9F0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  textoSemFoto: {
    color: '#666666',
    fontSize: 14,
  },

  nomeCarro: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 12,
  },

  informacoes: {
    marginBottom: 15,
  },

  info: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 7,
  },
});
