import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "./constants";
import { FaChevronDown } from "react-icons/fa";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

export function LanguageSelector (
  {
    language, onSelect
  }:
  {
    language: string;
    onSelect: (lang: string) => void;
  }
) {
    return (
        <Box >
          <Menu isLazy>
            <MenuButton as={Button} className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer hover:bg-dark-gray-6">
              <span className="flex items-center">
                {language} <FaChevronDown className="ml-2"/>
              </span>
            </MenuButton> 
            <MenuList className="flex d-flex flex-col p-1.5 gap-1.5 bg-gray-600 rounded-b-[5px] rounded-tr-[5px] text-xs mt-[-10px]">
            {languages.map(([lang, version]) => (
                lang !== language && <MenuItem
                key={lang}
                color={lang === language ? ACTIVE_COLOR : ""}
                bg={lang === language ? "gray.900" : "transparent"}
                _hover={{
                    color: ACTIVE_COLOR,
                    bg: "gray.900",
                }}
                onClick={() => onSelect(lang)}
                >
                {lang}
                &nbsp;
                <Text as="span" color="gray.600" fontSize="sm">
                    ({version})
                </Text>
                </MenuItem>
            ))}
            </MenuList>
          </Menu>
        </Box>
    );
};

