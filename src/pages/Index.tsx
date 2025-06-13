
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const familyData = {
  "grandfather": {
    "name": "Ahmed Kutty (Narimukkukkil Ayi Mutti)",
    "wives": [
      {
        "name": "Kootil Ayishabhi",
        "children": ["Muhammad (Valiya Kutti Mon)", "Abdullah Koya", "Ummer", "Kunjeevi"]
      },
      {
        "name": "Fathima (Puthiyarele)",
        "children": ["Abubackar", "Fathima", "Iyyathutti", "Hasan", "Kunjan", "Ummukulsum", "Hamsa", "Ramlabi"]
      },
      {
        "name": "Nafeesa (Naduvattam)",
        "children": ["Pennu", "Kutti Mol", "Koya", "Safiya", "Azeez"]
      },
      {
        "name": "Kauja",
        "children": ["Kunjan", "Jameela", "Suba", "Silu"]
      }
    ]
  },
  "siblings_of_grandfather": [
    {
      "name": "Kiriyaadath Kunjae Mutti Haji",
      "wife": "Thithikutty Hajjumma",
      "children": ["Kutti Mon", "Cheriyaava", "Kunjan", "Ayisha Mol"]
    },
    {
      "name": "Thottol Mammais Kutti",
      "wives": [
        {
          "name": "Aamina",
          "children": ["Koya Kutti", "Nabeesa", "Majeed", "Bichimol", "Suharaabi"]
        },
        {
          "name": "Kachallama",
          "children": ["Sulayya", "Abu", "Nabeesu", "Basheer", "Musthu", "Ashraf"]
        }
      ]
    }
  ]
};

interface PersonCardProps {
  name: string;
  relationship: string;
  searchTerm: string;
  hasImage?: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, relationship, searchTerm, hasImage = false }) => {
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center border-2 border-amber-300">
            {hasImage ? (
              <img src="/placeholder.svg" alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-amber-700" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 text-sm">
              {highlightText(name, searchTerm)}
            </h3>
            <p className="text-xs text-amber-700 opacity-80">{relationship}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface WifesSectionProps {
  wives: any[];
  searchTerm: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const WivesSection: React.FC<WifesSectionProps> = ({ wives, searchTerm, isExpanded, onToggle }) => {
  return (
    <div className="ml-8 border-l-2 border-amber-200 pl-6">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="mb-4 text-amber-800 hover:bg-amber-100 p-2"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
        Wives & Children ({wives.reduce((total, wife) => total + (wife.children?.length || 0), 0)} children)
      </Button>
      
      {isExpanded && (
        <div className="space-y-6 animate-fade-in">
          {wives.map((wife, wifeIndex) => (
            <div key={wifeIndex} className="space-y-3">
              <PersonCard 
                name={wife.name} 
                relationship="Wife" 
                searchTerm={searchTerm}
              />
              
              {wife.children && wife.children.length > 0 && (
                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {wife.children.map((child: string, childIndex: number) => (
                    <PersonCard 
                      key={childIndex}
                      name={child} 
                      relationship="Child" 
                      searchTerm={searchTerm}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    grandfather: true,
    siblings: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const allNames = useMemo(() => {
    const names: string[] = [];
    
    // Add grandfather
    names.push(familyData.grandfather.name);
    
    // Add grandfather's wives and children
    familyData.grandfather.wives.forEach(wife => {
      names.push(wife.name);
      if (wife.children) {
        names.push(...wife.children);
      }
    });
    
    // Add siblings and their families
    familyData.siblings_of_grandfather.forEach(sibling => {
      names.push(sibling.name);
      if (sibling.wife) {
        names.push(sibling.wife);
      }
      if (sibling.wives) {
        sibling.wives.forEach((wife: any) => {
          names.push(wife.name);
          if (wife.children) {
            names.push(...wife.children);
          }
        });
      }
      if (sibling.children) {
        names.push(...sibling.children);
      }
    });
    
    return names;
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    
    return allNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allNames]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-orange-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Family Tree Explorer</h1>
          <p className="text-amber-100 text-lg">Discover your roots and heritage</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <Card className="mb-8 border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-semibold text-amber-900">Search Family Members</h2>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
            />
            
            {filteredResults && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3">
                  Search Results ({filteredResults.length} found)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredResults.map((name, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-amber-100">
                      <span className="text-sm text-amber-800">
                        {name.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, i) => 
                          new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(part) ? (
                            <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
                          ) : part
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grandfather Section */}
        <Card className="mb-8 border-amber-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-900">Grandfather's Family</h2>
              <Button
                variant="ghost"
                onClick={() => toggleSection('grandfather')}
                className="text-amber-700 hover:bg-amber-100"
              >
                {expandedSections.grandfather ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <PersonCard 
                name={familyData.grandfather.name} 
                relationship="Grandfather" 
                searchTerm={searchTerm}
              />
              
              {expandedSections.grandfather && (
                <WivesSection
                  wives={familyData.grandfather.wives}
                  searchTerm={searchTerm}
                  isExpanded={expandedSections.grandfatherWives || false}
                  onToggle={() => toggleSection('grandfatherWives')}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Siblings Section */}
        <Card className="border-amber-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-900">Grandfather's Siblings</h2>
              <Button
                variant="ghost"
                onClick={() => toggleSection('siblings')}
                className="text-amber-700 hover:bg-amber-100"
              >
                {expandedSections.siblings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {expandedSections.siblings && (
              <div className="space-y-8 animate-fade-in">
                {familyData.siblings_of_grandfather.map((sibling, index) => (
                  <div key={index} className="space-y-4">
                    <PersonCard 
                      name={sibling.name} 
                      relationship="Grandfather's Sibling" 
                      searchTerm={searchTerm}
                    />
                    
                    <div className="ml-8 border-l-2 border-amber-200 pl-6 space-y-4">
                      {/* Single wife */}
                      {sibling.wife && (
                        <PersonCard 
                          name={sibling.wife} 
                          relationship="Wife" 
                          searchTerm={searchTerm}
                        />
                      )}
                      
                      {/* Multiple wives */}
                      {sibling.wives && (
                        <div className="space-y-4">
                          {sibling.wives.map((wife: any, wifeIndex: number) => (
                            <div key={wifeIndex} className="space-y-3">
                              <PersonCard 
                                name={wife.name} 
                                relationship="Wife" 
                                searchTerm={searchTerm}
                              />
                              
                              {wife.children && wife.children.length > 0 && (
                                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {wife.children.map((child: string, childIndex: number) => (
                                    <PersonCard 
                                      key={childIndex}
                                      name={child} 
                                      relationship="Child" 
                                      searchTerm={searchTerm}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Direct children (for single wife cases) */}
                      {sibling.children && !sibling.wives && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {sibling.children.map((child: string, childIndex: number) => (
                            <PersonCard 
                              key={childIndex}
                              name={child} 
                              relationship="Child" 
                              searchTerm={searchTerm}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Future Generations Placeholder */}
        <Card className="mt-8 border-dashed border-2 border-amber-300 bg-amber-50/50">
          <CardContent className="p-8 text-center">
            <div className="text-amber-600">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Future Generations</h3>
              <p className="text-sm opacity-75">This section is ready for additional family members and generations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
