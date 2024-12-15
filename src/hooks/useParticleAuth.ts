import { useState, useEffect } from 'react';
    import { useParticleConnect } from '@particle-network/connect-react';
    import { useAtom } from 'jotai';
    import { authAtom } from '../store/authAtom';
    import type { SocialLoginType } from '../lib/particle';

    export function useParticleAuth() {
      const [user, setUser] = useAtom(authAtom);
      const { connect, disconnect, account, login, logout } = useParticleConnect();
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        // Check if user is already connected on mount
        const checkConnection = async () => {
          setIsLoading(true);
          try {
            const isConnected = await connect();
            if (isConnected) {
              setUser(account);
            }
          } catch (error) {
            console.error('Error checking connection:', error);
          } finally {
            setIsLoading(false);
          }
        };
        checkConnection();
      }, [connect, setUser, account]);

      const connectWallet = async (type: SocialLoginType) => {
        setIsLoading(true);
        try {
          const result = await login(type);
          if (result) {
            setUser(account);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          setIsLoading(false);
        }
      };

      return { connectWallet, isLoading, connect, disconnect, account, login, logout };
    }
