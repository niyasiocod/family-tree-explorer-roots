import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const familyData = {
  "main_family": {
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
  "other_family_members": [
    {
      "name": "Kiriyaadath Kunjae Mutti Haji",
      "wife": "Thithikutty Hajjumma",
      "children": ["Kutti Mon", "Cheriyaaka", "Abu", "Malu", "Kunjan", "Ayisha Mol"],
      "relationship": "Sibling of Ahmed Kutty"
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
      ],
      "relationship": "Sibling of Ahmed Kutty"
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
    <Card className="hover:shadow-md transition-all duration-200 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center border-2 border-blue-300">
            {hasImage ? (
              <img src="/placeholder.svg" alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-blue-700" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 text-sm">
              {highlightText(name, searchTerm)}
            </h3>
            <p className="text-xs text-blue-700 opacity-80">{relationship}</p>
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
  const [openWifeIndexes, setOpenWifeIndexes] = useState<{[key:number]: boolean}>({});

  const toggleWifeSection = (index: number) => {
    setOpenWifeIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="ml-8 border-l-2 border-blue-200 pl-6">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="mb-4 text-blue-800 hover:bg-blue-100 p-2"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
        Wives ({wives.length})
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
              <Collapsible open={!!openWifeIndexes[wifeIndex]} onOpenChange={() => toggleWifeSection(wifeIndex)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-2 text-blue-700"
                  >
                    {openWifeIndexes[wifeIndex] ? <ChevronUp className="inline w-4 h-4 mr-1" /> : <ChevronDown className="inline w-4 h-4 mr-1" />}
                    {openWifeIndexes[wifeIndex] ? 'Hide Children' : 'Show Children'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {wife.children && wife.children.length > 0 ? (
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                      {wife.children.map((child: string, childIndex: number) => (
                        <PersonCard 
                          key={childIndex}
                          name={child} 
                          relationship="Child" 
                          searchTerm={searchTerm}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="ml-6 text-blue-500 text-sm">No children listed.</div>
                  )}
                </CollapsibleContent>
              </Collapsible>
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
    mainFamily: true,
    otherMembers: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const allNames = useMemo(() => {
    const names: string[] = [];
    
    // Add main family member
    names.push(familyData.main_family.name);
    
    // Add main family wives and children
    familyData.main_family.wives.forEach(wife => {
      names.push(wife.name);
      if (wife.children) {
        names.push(...wife.children);
      }
    });
    
    // Add other family members and their families
    familyData.other_family_members.forEach(member => {
      names.push(member.name);
      if (member.wife) {
        names.push(member.wife);
      }
      if (member.wives) {
        member.wives.forEach((wife: any) => {
          names.push(wife.name);
          if (wife.children) {
            names.push(...wife.children);
          }
        });
      }
      if (member.children) {
        names.push(...member.children);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Narimukkil Family</h1>
          <p className="text-blue-100 text-lg">Discover our family heritage and connections</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <Card className="mb-8 border-blue-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-semibold text-blue-900">Search Family Members</h2>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
            />
            
            {filteredResults && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Search Results ({filteredResults.length} found)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredResults.map((name, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-blue-100">
                      <span className="text-sm text-blue-800">
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

        {/* Main Family Section */}
        <Card className="mb-8 border-blue-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Ahmed Kutty's Family</h2>
              <Button
                variant="ghost"
                onClick={() => toggleSection('mainFamily')}
                className="text-blue-700 hover:bg-blue-100"
              >
                {expandedSections.mainFamily ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <PersonCard 
                name={familyData.main_family.name} 
                relationship="Family Head" 
                searchTerm={searchTerm}
              />
              
              {expandedSections.mainFamily && (
                <WivesSection
                  wives={familyData.main_family.wives}
                  searchTerm={searchTerm}
                  isExpanded={expandedSections.mainFamilyWives || false}
                  onToggle={() => toggleSection('mainFamilyWives')}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Other Family Members Section */}
        <Card className="border-blue-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Ahmed Kutty's Siblings</h2>
              <Button
                variant="ghost"
                onClick={() => toggleSection('otherMembers')}
                className="text-blue-700 hover:bg-blue-100"
              >
                {expandedSections.otherMembers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {expandedSections.otherMembers && (
              <div className="space-y-8 animate-fade-in">
                {familyData.other_family_members.map((member, index) => (
                  <div key={index} className="space-y-4">
                    <PersonCard 
                      name={member.name} 
                      relationship={member.relationship || "Family Member"} 
                      searchTerm={searchTerm}
                    />
                    
                    <div className="ml-8 border-l-2 border-blue-200 pl-6 space-y-4">
                      {/* Single wife */}
                      {member.wife && (
                        <div className="space-y-2">
                          <PersonCard 
                            name={member.wife} 
                            relationship="Wife" 
                            searchTerm={searchTerm}
                          />
                          {member.children && !member.wives && (
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="mb-2 text-blue-700">
                                  <ChevronDown className="inline w-4 h-4 mr-1" /> Show Children
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                                  {member.children.map((child: string, childIndex: number) => (
                                    <PersonCard 
                                      key={childIndex}
                                      name={child} 
                                      relationship="Child" 
                                      searchTerm={searchTerm}
                                    />
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>
                      )}
                      
                      {/* Multiple wives */}
                      {member.wives && (
                        <div className="space-y-4">
                          {member.wives.map((wife: any, wifeIndex: number) => (
                            <div key={wifeIndex} className="space-y-3">
                              <PersonCard 
                                name={wife.name} 
                                relationship="Wife" 
                                searchTerm={searchTerm}
                              />
                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button variant="outline" size="sm" className="mb-2 text-blue-700">
                                    <ChevronDown className="inline w-4 h-4 mr-1" /> Show Children
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  {wife.children && wife.children.length > 0 ? (
                                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                                      {wife.children.map((child: string, childIndex: number) => (
                                        <PersonCard 
                                          key={childIndex}
                                          name={child} 
                                          relationship="Child" 
                                          searchTerm={searchTerm}
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="ml-6 text-blue-500 text-sm">No children listed.</div>
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
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
        <Card className="mt-8 border-dashed border-2 border-blue-300 bg-blue-50/50">
          <CardContent className="p-8 text-center">
            <div className="text-blue-600">
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
