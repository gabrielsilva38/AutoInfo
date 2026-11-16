import React, { useState } from 'react';

import {View, Text, FlatList, StyleSheet,} from 'react-native';
import { Carro } from '../types/carro';
import CardCarro from '../componentes/CardCarro';
import DetalhesCarro from '../componentes/DetalhesCarro';


type Props = {
  carrosFavoritos: Carro[];
  setFavoritos: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TelaFavoritos({
  carrosFavoritos,
  setFavoritos,
}: Props) {

const [carroSelecionado, setCarroSelecionado] = useState<Carro | null>(null);

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

      <Text style={styles.titulo}>
        Meus Favoritos ⭐​
      </Text>

      <FlatList
        data={carrosFavoritos}
        numColumns={2}
        keyExtractor={(item) =>
          `${item.marca}-${item.modelo}-${item.ano}`
        }
        renderItem={({ item }) => (
  <CardCarro
    carro={item}
    estaFavoritado={true}
    onFavoritar={() =>
      setFavoritos((atuais) =>
        atuais.filter((modelo) => modelo !== item.modelo)
      )
    }
    onVerDetalhes={() => setCarroSelecionado(item)}
  />
)}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Você ainda não possui favoritos.
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    padding: 20,
    paddingTop: 60,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#172B4D',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#172B4D',
  },

  vazio: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});
