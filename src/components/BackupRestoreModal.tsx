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
  Badge,
  FormHelperText
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
  onboardingMode?: boolean; // Neuer Parameter für den Onboarding-Modus
}

const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 0,
  onImportSuccess,
  onboardingMode = false
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
    importCustomFoods: true,
  });
  
  // Backup-Einstellungen
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackupEnabled: false,
    backupFrequency: 'weekly',
    lastBackupDate: '',
    keepBackupsCount: 3
  });
  
  // Lade die Backup-Einstellungen beim Öffnen des Modals
  useEffect(() => {
    if (isOpen && !onboardingMode) {
      const settings = BackupService.getBackupSettings();
      setBackupSettings(settings);
    }
  }, [isOpen, onboardingMode]);

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
          <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
            {!onboardingMode && (
              <TabList>
                <Tab>{t('backup.exportTab')}</Tab>
                <Tab>{t('backup.importTab')}</Tab>
                <Tab>{t('backup.settingsTab')}</Tab>
              </TabList>
            )}
            
            <TabPanels>
              {/* Export-Tab - nur anzeigen, wenn nicht im Onboarding-Modus */}
              {!onboardingMode && (
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>{t('backup.exportTab')}</AlertTitle>
                        <AlertDescription>
                          {t('backup.backupInfo')}
                        </AlertDescription>
                      </Box>
                    </Alert>
                    
                    <Button 
                      leftIcon={<DownloadIcon />} 
                      colorScheme="blue" 
                      onClick={handleExport}
                      isLoading={isLoading}
                      loadingText={t('backup.creatingBackup')}
                    >
                      {t('backup.createBackup')}
                    </Button>
                  </VStack>
                </TabPanel>
              )}
              
              {/* Import-Tab - immer anzeigen */}
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
                          variant="ghost" 
                          onClick={() => setBackupData(null)}
                        >
                          {t('common.cancel')}
                        </Button>
                      </HStack>
                    </>
                  )}
                </VStack>
              </TabPanel>
              
              {/* Einstellungen-Tab - nur anzeigen, wenn nicht im Onboarding-Modus */}
              {!onboardingMode && (
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>{t('backup.settingsTab')}</AlertTitle>
                        <AlertDescription>
                          {t('backup.settingsInfo')}
                        </AlertDescription>
                      </Box>
                    </Alert>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="auto-backup" mb="0">
                        {t('backup.enableAutoBackup')}
                      </FormLabel>
                      <Switch 
                        id="auto-backup" 
                        isChecked={backupSettings.autoBackupEnabled}
                        onChange={(e) => handleBackupSettingsChange('autoBackupEnabled', e.target.checked)}
                      />
                    </FormControl>
                    
                    {backupSettings.autoBackupEnabled && (
                      <>
                        <FormControl>
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
                        
                        <FormControl>
                          <FormLabel>{t('backup.keepBackupsCount')}</FormLabel>
                          <Select 
                            value={backupSettings.keepBackupsCount.toString()}
                            onChange={(e) => handleBackupSettingsChange('keepBackupsCount', parseInt(e.target.value))}
                          >
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                          </Select>
                          <FormHelperText>
                            {t('backup.keepBackupsInfo')}
                          </FormHelperText>
                        </FormControl>
                        
                        {backupSettings.lastBackupDate && (
                          <HStack>
                            <FiClock />
                            <Text fontSize="sm">
                              {t('backup.lastBackup')}: {new Date(backupSettings.lastBackupDate).toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                      </>
                    )}
                    
                    <Button 
                      colorScheme="blue" 
                      onClick={handleSaveBackupSettings}
                      isLoading={isLoading}
                      loadingText={t('backup.saving')}
                      leftIcon={<SettingsIcon />}
                    >
                      {t('backup.saveSettings')}
                    </Button>
                  </VStack>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
          
          {isLoading && <Progress size="xs" isIndeterminate mt={4} />}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t('common.close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BackupRestoreModal; 