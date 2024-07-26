import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { ConfigHelper } from "@homzhub/common/src/utils/ConfigHelper";
import { theme } from "@homzhub/common/src/styles/theme";
import { Label } from "@homzhub/common/src/components/atoms/Text";
import { Platform } from "react-native";

export enum OtpTypes {
  PhoneOrEmail = "PhoneOrEmail",
  Email = "Email",
}

interface IProps {
  error?: string;
  otpType?: OtpTypes;
  bubbleOtp: (otp: string, otpType?: OtpTypes) => void;
  toggleError: () => void;
  shouldClear?: boolean;
}

export const OtpInputs: React.FC<IProps> = ({
  error,
  otpType,
  bubbleOtp,
  toggleError,
  shouldClear,
}) => {
  const OtpLength = ConfigHelper.getOtpLength();
  const [otp, setOtp] = useState(() => Array(OtpLength).fill(""));
  const [currentFocus, setCurrentFocus] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const focusNext = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
       
        const digits = value.split("").slice(0, OtpLength - index);
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (index + i < OtpLength) {
            newOtp[index + i] = digit;
          }
        });
        setOtp(newOtp);
        const nextFocus = Math.min(index + digits.length, OtpLength - 1);
        setCurrentFocus(nextFocus);
        inputRefs.current[nextFocus]?.focus();
      } else {
        setOtp((prev) => {
          const newOtp = [...prev];
          newOtp[index] = value;
          return newOtp;
        });

        if (value !== "") {
          if (index < OtpLength - 1) {
            setCurrentFocus(index + 1);
            inputRefs.current[index + 1]?.focus();
          } else {
            inputRefs.current[index]?.blur();
          }
        }
      }
    },
    [OtpLength]
  );

  const focusPrevious = useCallback(
    (index: number) => {
      if (index > 0) {
        setOtp((prev) => {
          const newOtp = [...prev];
          newOtp[index] = "";
          return newOtp;
        });
        setCurrentFocus(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else if (index === 0) {
        setOtp((prev) => {
          const newOtp = [...prev];
          newOtp[0] = "";
          return newOtp;
        });
      }

      if (error) {
        toggleError();
      }
    },
    [error, toggleError]
  );

  const handleKeyPress = useCallback(
    (event: any, index: number) => {
      if (
        (Platform.OS === "web" && event.key === "Backspace") ||
        (Platform.OS !== "web" && event.nativeEvent.key === "Backspace")
      ) {
        if (otp[index] === "") {
          focusPrevious(index);
        }
      }
    },
    [otp, focusPrevious]
  );

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (shouldClear) {
      setOtp(Array(OtpLength).fill(""));
      setCurrentFocus(0);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [shouldClear, OtpLength]);

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      bubbleOtp(otp.join(""), otpType);
    }
  }, [otp, bubbleOtp, otpType]);

  return (
    <View style={styles.container}>
      <View style={styles.otpBoxContainer}>
        {Array(OtpLength)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.textInput,
                currentFocus === index && styles.active,
                error && styles.error,
              ]}
              keyboardType="number-pad"
              maxLength={OtpLength}
              value={otp[index]}
              onChangeText={(value) => focusNext(index, value)}
              onKeyPress={(event) => handleKeyPress(event, index)}
            />
          ))}
      </View>
      {error && (
        <Label type="regular" style={styles.errorText}>
          {error}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  otpBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 4,
    height: 48,
    width: 48,
    borderColor: theme.colors.disabled,
    color: theme.colors.darkTint1,
  },
  errorText: {
    marginTop: 8,
    color: theme.colors.error,
  },
  active: {
    borderColor: theme.colors.active,
  },
  error: {
    borderColor: theme.colors.error,
  },
});
