
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

import { Usuario } from '../types/Usuario';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  usuarios: Usuario[];
  usuarioLogado: Usuario | null;
  onCadastrar: (usuario: Usuario) => void;
  onLogin: (usuario: Usuario) => void;
  onSair: () => void;
};

export default function TelaCadastroUsuario({
  usuarios,
  usuarioLogado,
  onCadastrar,
  onLogin,
  onSair,
}: Props) {
  // Estados do cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  // Estados do login
  const [modoLogin, setModoLogin] = useState(true);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');

  // Mensagens
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Escolher foto da galeria
  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  // Tirar foto com a câmera
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

  // Fazer login
  const entrarNaConta = () => {
    setMensagemErro('');
    setMensagemSucesso('');

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.email.toLowerCase() ===
          emailLogin.trim().toLowerCase() &&
        usuario.senha === senhaLogin
    );

    if (!usuarioEncontrado) {
      setMensagemErro('E-mail ou senha incorretos!');
      return;
    }

    onLogin(usuarioEncontrado);

    setMensagemSucesso('Login realizado com sucesso!');
    setEmailLogin('');
    setSenhaLogin('');
  };

  // Cadastrar usuário
  const cadastrarUsuario = () => {
    setMensagemErro('');
    setMensagemSucesso('');

    if (
      nome.trim() === '' ||
      email.trim() === '' ||
      telefone.trim() === '' ||
      senha.trim() === ''
    ) {
      setMensagemErro('Preencha todos os campos!');
      return;
    }

    const emailLimpo = email.trim().toLowerCase();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      emailLimpo
    );

    if (!emailValido) {
      setMensagemErro('Digite um e-mail válido!');
      return;
    }

    const usuarioExistente = usuarios.some(
      (usuario) =>
        usuario.email.toLowerCase() === emailLimpo
    );

    if (usuarioExistente) {
      setMensagemErro('Este e-mail já está cadastrado!');
      return;
    }

    const novoUsuario: Usuario = {
      nome: nome.trim(),
      email: emailLimpo,
      telefone: telefone.trim(),
      senha: senha,
      foto: foto,
    };

    onCadastrar(novoUsuario);

    setMensagemSucesso('Usuário cadastrado com sucesso!');

    setNome('');
    setEmail('');
    setTelefone('');
    setSenha('');
    setFoto(null);
  };

  // Sair da conta
  const sairDaConta = () => {
    onSair();
    setModoLogin(true);
    setMensagemErro('');
    setMensagemSucesso('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Minha Conta
      </Text>

      {mensagemErro !== '' && (
        <Text style={styles.erro}>
          {mensagemErro}
        </Text>
      )}

      {mensagemSucesso !== '' && (
        <Text style={styles.sucesso}>
          {mensagemSucesso}
        </Text>
      )}

      {usuarioLogado ? (
        <>
          <Text style={styles.subtitulo}>
            Bem-vindo(a), {usuarioLogado.nome}!
          </Text>

          {usuarioLogado.foto && (
            <Image
              source={{ uri: usuarioLogado.foto }}
              style={styles.foto}
            />
          )}

          <Text style={styles.textoAlternativo}>
            E-mail: {usuarioLogado.email}
          </Text>

          <Text style={styles.textoAlternativo}>
            Telefone: {usuarioLogado.telefone}
          </Text>

          <View style={styles.botao}>
            <Button
              title="Sair da conta"
              onPress={sairDaConta}
              color="#D32F2F"
            />
          </View>
        </>
      ) : modoLogin ? (
        <>
          <Text style={styles.subtitulo}>
            Entre na sua conta
          </Text>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#777"
            value={emailLogin}
            onChangeText={setEmailLogin}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#777"
            value={senhaLogin}
            onChangeText={setSenhaLogin}
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.botao}>
            <Button
              title="Entrar"
              onPress={entrarNaConta}
              color="#1565C0"
            />
          </View>

          <Text style={styles.textoAlternativo}>
            Ainda não tem uma conta?
          </Text>

          <Button
            title="Criar conta"
            onPress={() => {
              setModoLogin(false);
              setMensagemErro('');
              setMensagemSucesso('');
            }}
            color="#555"
          />
        </>
      ) : (
        <>
          <Text style={styles.subtitulo}>
            Preencha seus dados
          </Text>

          {foto !== null && (
            <Image
              source={{ uri: foto }}
              style={styles.foto}
            />
          )}

          <View style={styles.botao}>
            <Button
              title="Escolher foto da galeria"
              onPress={escolherFoto}
              color="#1565C0"
            />
          </View>

          <View style={styles.botao}>
            <Button
              title="Tirar foto com a câmera"
              onPress={tirarFoto}
              color="#1565C0"
            />
          </View>

          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#777"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Telefone"
            placeholderTextColor="#777"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#777"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.botao}>
            <Button
              title="Cadastrar"
              onPress={cadastrarUsuario}
              color="#1565C0"
            />
          </View>

          <Text style={styles.textoAlternativo}>
            Já possui uma conta?
          </Text>

          <Button
            title="Voltar para o login"
            onPress={() => {
              setModoLogin(true);
              setMensagemErro('');
              setMensagemSucesso('');
            }}
            color="#555"
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 18,
    textAlign: 'center',
    color: '#444',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFFFFF',
    color: '#222',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  erro: {
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  sucesso: {
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },

  botao: {
    marginVertical: 3,
  },

  textoAlternativo: {
    textAlign: 'center',
    color: '#444',
    marginTop: 10,
  },
});
