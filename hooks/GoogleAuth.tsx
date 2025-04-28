// filepath: [GoogleAuth.tsx](http://_vscodecontentref_/0)
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '@/supabaseClient';
import { toast } from 'sonner';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.email'], // Request email scope
  webClientId: '143689437250-2a3v5j3v3imjoml58sk3aau04hgkhibv.apps.googleusercontent.com', // Replace with your web client ID
});

export default function GoogleAuth() {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = (await GoogleSignin.getTokens()).idToken; // Retrieve the idToken using getTokens
      if (idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });

        if (error) {
          console.error('Error signing in with Google:', error);
          toast.error('Failed to sign in with Google');
          return;
        }

        toast.success('Successfully signed in with Google!');
      } else {
        throw new Error('No ID token found');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('An unexpected error occurred:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
      <Text style={styles.googleButtonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


