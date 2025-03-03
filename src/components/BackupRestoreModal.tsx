import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Checkbox,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Progress,
  Divider,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Badge
} from '@chakra-ui/react';
import { DownloadIcon, SettingsIcon } from '@chakra-ui/icons';
import { FiUpload, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { BackupService, BackupData, BackupSettings } from '../services/BackupService';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: number; // 0 für Export, 1 für Import, 2 für Einstellungen
  onImportSuccess?: () => void; // Callback für erfolgreichen Import
}

const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 0,
  onImportSuccess 
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(defaultTab);
  const [importOptions, setImportOptions] = useState({
    importUserData: true,
    importMealPlan: true,
    importRecipes: true,
    importMeals: true,
    importCustomFoods: true
  });
  
  // State für automatische Backup-Einstellungen
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackupEnabled: false,
    backupFrequency: 'weekly',
    lastBackupDate: null
  });

  // Lade die Backup-Einstellungen beim Öffnen des Modals
  useEffect(() => {
    if (isOpen) {
      const settings = BackupService.getBackupSettings();
      setBackupSettings(settings);
    }
  }, [isOpen]);

  // Setze den Tab-Index, wenn sich defaultTab ändert
  useEffect(() => {
    setTabIndex(defaultTab);
  }, [defaultTab]);

  // Handler für den Export-Button
  const handleExport = () => {
    try {
      setIsLoading(true);
      BackupService.exportBackup();
      toast({
        title: t('backup.backupSuccess'),
        description: t('backup.backupSuccessDesc'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('backup.backupError'),
        description: t('backup.backupErrorDesc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Backup-Fehler:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler für die Dateiauswahl
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsLoading(true);
      const file = files[0];
      const data = await BackupService.readBackupFile(file);
      setBackupData(data);
      
      toast({
        title: t('backup.fileLoadSuccess'),
        description: t('backup.fileLoadSuccessDesc'),
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('backup.fileLoadError'),
        description: t('backup.fileLoadErrorDesc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Fehler beim Lesen der Backup-Datei:', error);
    } finally {
      setIsLoading(false);
      // Zurücksetzen des Datei-Inputs, damit der gleiche File erneut ausgewählt werden kann
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handler für den Import-Button
  const handleImport = () => {
    if (!backupData) return;

    try {
      setIsLoading(true);
      const result = BackupService.importBackup(backupData, importOptions);
      
      if (result.success) {
        toast({
          title: t('backup.importSuccess'),
          description: t('backup.importSuccessDesc'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setBackupData(null);
        
        // Rufe den onImportSuccess-Callback auf, wenn vorhanden
        if (onImportSuccess) {
          onImportSuccess();
        }
        
        onClose();
      } else {
        toast({
          title: t('backup.importError'),
          description: t(result.message),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('backup.importError'),
        description: t('backup.importErrorDesc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Import-Fehler:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler für Änderungen an den Import-Optionen
  const handleOptionChange = (option: keyof typeof importOptions) => {
    setImportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Handler für Änderungen an den Backup-Einstellungen
  const handleBackupSettingsChange = (field: keyof BackupSettings, value: any) => {
    setBackupSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handler für das Speichern der Backup-Einstellungen
  const handleSaveBackupSettings = () => {
    try {
      setIsLoading(true);
      
      // Wenn automatische Backups aktiviert wurden, erstelle sofort ein Backup
      if (backupSettings.autoBackupEnabled) {
        const success = BackupService.createAutoBackup();
        if (success) {
          // Aktualisiere das Datum des letzten Backups
          backupSettings.lastBackupDate = new Date().toISOString();
        }
      }
      
      // Speichere die Einstellungen
      BackupService.saveBackupSettings(backupSettings);
      
      toast({
        title: t('backup.settingsSaved'),
        description: t('backup.settingsSavedDesc'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('backup.settingsError'),
        description: t('backup.settingsErrorDesc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Fehler beim Speichern der Backup-Einstellungen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('backup.title')}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs isFitted variant="enclosed" index={tabIndex} onChange={setTabIndex}>
            <TabList mb="1em">
              <Tab>{t('backup.exportTab')}</Tab>
              <Tab>{t('backup.importTab')}</Tab>
              <Tab>{t('backup.settingsTab')}</Tab>
            </TabList>
            
            <TabPanels>
              {/* Export-Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{t('profile.dataManagement')}</AlertTitle>
                      <AlertDescription>
                        {t('backup.backupInfo')}
                      </AlertDescription>
                    </Box>
                  </Alert>
                  
                  <Text>{t('backup.dataIncluded')}</Text>
                  <VStack align="start" pl={4}>
                    <Text>• {t('backup.profileSettings')}</Text>
                    <Text>• {t('backup.savedRecipes')}</Text>
                    <Text>• {t('backup.mealPlans')}</Text>
                    <Text>• {t('backup.customFoods')}</Text>
                    <Text>• {t('backup.trackingData')}</Text>
                  </VStack>
                  
                  <Button 
                    leftIcon={<DownloadIcon />} 
                    colorScheme="green" 
                    onClick={handleExport}
                    isLoading={isLoading}
                    loadingText={t('backup.exporting')}
                    mt={4}
                  >
                    {t('backup.createBackup')}
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Import-Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{t('backup.importTab')}</AlertTitle>
                      <AlertDescription>
                        {t('backup.restoreInfo')}
                      </AlertDescription>
                    </Box>
                  </Alert>
                  
                  {!backupData ? (
                    <>
                      <Text>{t('backup.selectBackupFile')}:</Text>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      <Button 
                        leftIcon={<FiUpload />} 
                        colorScheme="blue" 
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={isLoading}
                        loadingText={t('backup.loadingFile')}
                      >
                        {t('backup.selectBackupFile')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>{t('backup.backupLoaded')}</AlertTitle>
                          <AlertDescription>
                            {t('backup.backupDate')} {new Date(backupData.timestamp).toLocaleString()}
                          </AlertDescription>
                        </Box>
                      </Alert>
                      
                      <Divider my={2} />
                      
                      <Text fontWeight="bold">{t('backup.whatToImport')}</Text>
                      <VStack align="start" spacing={2}>
                        <Checkbox 
                          isChecked={importOptions.importUserData}
                          onChange={() => handleOptionChange('importUserData')}
                        >
                          {t('backup.profileSettings')}
                        </Checkbox>
                        <Checkbox 
                          isChecked={importOptions.importMealPlan}
                          onChange={() => handleOptionChange('importMealPlan')}
                        >
                          {t('backup.mealPlans')}
                        </Checkbox>
                        <Checkbox 
                          isChecked={importOptions.importRecipes}
                          onChange={() => handleOptionChange('importRecipes')}
                        >
                          {t('backup.savedRecipes')}
                        </Checkbox>
                        <Checkbox 
                          isChecked={importOptions.importMeals}
                          onChange={() => handleOptionChange('importMeals')}
                        >
                          {t('backup.trackingData')}
                        </Checkbox>
                        <Checkbox 
                          isChecked={importOptions.importCustomFoods}
                          onChange={() => handleOptionChange('importCustomFoods')}
                        >
                          {t('backup.customFoods')}
                        </Checkbox>
                      </VStack>
                      
                      <HStack spacing={4} mt={4}>
                        <Button 
                          colorScheme="green" 
                          onClick={handleImport}
                          isLoading={isLoading}
                          loadingText={t('backup.importing')}
                        >
                          {t('backup.importData')}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setBackupData(null)}
                        >
                          {t('backup.cancel')}
                        </Button>
                      </HStack>
                    </>
                  )}
                </VStack>
              </TabPanel>
              
              {/* Einstellungen-Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{t('backup.autoBackupTitle')}</AlertTitle>
                      <AlertDescription>
                        {t('backup.autoBackupDesc')}
                      </AlertDescription>
                    </Box>
                  </Alert>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="auto-backup-switch" mb="0">
                      {t('backup.enableAutoBackup')}
                    </FormLabel>
                    <Switch 
                      id="auto-backup-switch" 
                      colorScheme="brand"
                      isChecked={backupSettings.autoBackupEnabled}
                      onChange={(e) => handleBackupSettingsChange('autoBackupEnabled', e.target.checked)}
                    />
                  </FormControl>
                  
                  {backupSettings.autoBackupEnabled && (
                    <>
                      <FormControl mt={4}>
                        <FormLabel>{t('backup.backupFrequency')}</FormLabel>
                        <Select 
                          value={backupSettings.backupFrequency}
                          onChange={(e) => handleBackupSettingsChange('backupFrequency', e.target.value)}
                        >
                          <option value="daily">{t('backup.daily')}</option>
                          <option value="weekly">{t('backup.weekly')}</option>
                          <option value="monthly">{t('backup.monthly')}</option>
                        </Select>
                      </FormControl>
                      
                      <Box mt={4}>
                        <Text fontWeight="bold" mb={2}>{t('backup.lastBackup')}</Text>
                        {backupSettings.lastBackupDate ? (
                          <Text>
                            {new Date(backupSettings.lastBackupDate).toLocaleString()}
                          </Text>
                        ) : (
                          <Badge colorScheme="yellow">{t('backup.noBackupYet')}</Badge>
                        )}
                      </Box>
                      
                      <Alert status="warning" borderRadius="md" mt={4} size="sm">
                        <AlertIcon />
                        <Box fontSize="sm">
                          <AlertDescription>
                            {t('backup.autoBackupWarning')}
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </>
                  )}
                  
                  <Button 
                    leftIcon={<SettingsIcon />} 
                    colorScheme="blue" 
                    onClick={handleSaveBackupSettings}
                    isLoading={isLoading}
                    loadingText={t('backup.savingSettings')}
                    mt={4}
                  >
                    {t('backup.saveSettings')}
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          {isLoading && <Progress size="xs" isIndeterminate mt={4} />}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t('backup.close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BackupRestoreModal; 