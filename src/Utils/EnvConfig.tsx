import Constants from 'expo-constants';

class EnvConfig {
    static ExtraConfig = null;

    static getApiHost() {
        var config = EnvConfig.getExtraConfig();

        if (__DEV__) {
            return config.API_HOST_DEV;
        }
        else {
            return config.API_HOST_PRO;
        }
    }

    static getVersion(): string {
        var config = EnvConfig.getExtraConfig();

        return config.APP_VERSION;
    }

    static getExtraConfig() {
        if (EnvConfig.ExtraConfig == null) {
            EnvConfig.ExtraConfig = Constants.manifest.extra;

            //console.log(EnvConfig.ExtraConfig);
        }

        return EnvConfig.ExtraConfig;
    }
}

export default EnvConfig;